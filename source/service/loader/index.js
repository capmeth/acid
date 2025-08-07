import { camelCase, capitalCase, kebabCase } from 'change-case'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import np from 'node:path'
import globit from '#lib/globit.js'
import { is, mapExtensions, uid } from '#utils'
import importer from '../importer/index.js'
import docson from './docson.js'
import doxie from './doxie.js'
import link from './parentization.js'
import { tdContent } from './takedown.js'


export default function(config)
{
    let { parsers, root, rootSection, toAssetId, toExampleFile, useFilenameOnly } = config;

    let promisedParsers = mapExtensions(parsers, importer(root));

    let fileRe = /^file:\//;

    return () => promisedParsers.then(async parsers =>
    {
        // create storage for parsed code blocks
        let blocks = tdContent.config.vars.blocks = [];
        
        let all = {}, files = {};

        let mapContent = item => 
        {
            if (is(item))
            {
                let { uid, content } = item;
                
                if (is(content))
                {
                    item.content = 'Article' + camelCase(uid);
                    files[`./${item.content}.svt`] = content;
                }
            }

            return item;
        }

        let reducer = async key =>
        {
            let { components, documents, overview, title, ...others } = sections[key];

            let main = fileRe.test(overview) ? { path: overview.replace(fileRe, '') } : { content: overview };

            return Promise.all(
            [
                // overview content
                parseContent({ ...main, title }).then(mapContent),
                // document files
                globit(documents, root)
                    .then(list => Promise.all(list.map(path => parseContent({ path, section: key })
                    .then(mapContent)))),
                // component files
                globit(components, root)
                    .then(list => Promise.all(list.map(path => parseComponent({ path, section: key })                    
                    .then(mapContent))))
            ])
            .then(([ main, documents, components ]) => 
            {
                components = components.filter(comp => is(comp));

                all[key] = 
                { 
                    ...main, 
                    ...(components.length ? { components } : {}), 
                    ...(documents.length ? { documents } : {}), 
                    ...others 
                };
            });
        }


        /**
            Loads and parses a component source file and it's accompanying 
            markdown example file.

            Returned promise will resolve to `undefined` if parsed source
            returns truthy value for `ignore`.

            @param { object } object
                - `path` (string): path to the component source file
            @return { object }
                All data returned by `platform.parse` merged over original data.
        */
        async function parseComponent(object)
        {
            let { path, ...more } = object;

            if (is.string(path))
            {
                let abspath = np.resolve(root, path), ext = np.extname(abspath);
                let parser = { ...parsers['*'], ...parsers[ext] };

                if (parser.use)
                {
                    let data = doxie();
                    await parser.use(abspath, data, docson);

                    let { example, name, ...others } = data;
                    more = { ...others, ...more, title: name, path: example };
                }

                // skip processing for ignored component
                if (more.ignore) return void 0;

                if (useFilenameOnly || !more.title)
                    more.title = np.basename(path, np.extname(path));
                
                if (!more.path)
                    more.path = toExampleFile(path);

                // more.uid = uid.hex([ abspath, more.section ]) + '-' + kebabCase(more.title);
                more.uid = kebabCase(toAssetId(path));
                more.group = 'components';
                more.type = 'component';

                return parseContent(more);
            }

            return more;
        }


        /**
            Loads a markdown content file.

            Title for the docspec is derived from `title` front-matter value in
            the content file or the basename for the file.

            @param { object } object
                - `content` (string): markdown content
                - `path` (string): path to the markdown file
            @return { object }
                - `content` (string): html content
                - `title` (string): name for the document (if not already set)
        */
        async function parseContent(object)
        {
            let { content, path, ...more } = object;

            let apply = (content) => 
            {
                let fm = tdContent.parseMeta(content);

                if (fm)
                {
                    if (fm.cobeMode) more.cobeMode = fm.cobeMode;
                    if (fm.title) more.title ||= fm.title;
                    if (fm.tags) more.tags ||= is.array(fm.tags) ? fm.tags : fm.tags.split(/\s*,\s*/);
                    if (fm.tocDepth || fm.tocDepth === 0) more.tocDepth = fm.tocDepth;
                }
                more.title ||= capitalCase(np.basename(path, np.extname(path)));
                more.group ||= 'documents';
                more.type ||= 'document';
                // more.uid ||= uid.hex([ abspath, more.section ]) + '-' + kebabCase(more.title);
                more.uid ||= kebabCase(path ? toAssetId(path) : uid.hex([ more.title, more.section ]));

                let vars = { uid: more.uid }
                return { ...more, content: tdContent.parse(content, { vars }).doc };
            }
            // assume content already on the object is markdown
            if (content) return apply(content);

            if (is.string(path))
            {
                let abspath = np.resolve(root, path);
                
                if (existsSync(abspath))
                    return fs.readFile(abspath, 'utf8').then(apply);
            }

            return more;
        }

        let sections = link(config.sections, rootSection);
        let sectionKeys = Object.keys(sections);

        log.info(`${sectionKeys.length} section(s) included in docsite`);

        return Promise.all(sectionKeys.map(reducer)).then(() => ({ sections: all, files, blocks }));
    })
}
