import { capitalCase, kebabCase, pascalCase } from 'change-case'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import np from 'node:path'
import globit from '#lib/globit.js'
import paths from '#paths'
import { is } from '#utils'
import docson from '../docson.js'
import doxie from '../doxie.js'


let commaRe = /\s*,\s*/;
let fileRe = /^file:\//;

export default function(config)
{
    let { assetTypes, root, tagLegend, toAssetId, toExampleFile, useFilenameOnly } = config;    
    let types = Object.entries(assetTypes);
    let tagmap = new Map();

    Object.entries(tagLegend).forEach(([ key, val ]) => val.assign && tagmap.set(val.assign, key));


    let op = {};

    /**
        Processes assets for `record`.

        @param { object } record
          - `name`: name of record
          - asset group properties (consumed)
        @return { object}
          - `assets`: uids of associated assets
    */
    op.assets = record =>
    {
        let { name } = record;

        return async ({ assemble }) =>
        {
            let mapTypes = async ([ tid, { plural, singular } ]) => 
            {
                let files = await globit(record[plural], root);
                let mapFiles = path => assemble[singular]({ path, section: name, tid })
                let filterFiles = list => list.filter(is).map(item => item.uid)

                delete record[plural];

                return Promise.all(files.map(mapFiles)).then(filterFiles);
            }

            record.assets = await Promise.all(types.map(mapTypes)).then(array => array.flat());

            return record;
        }
    }    


    /**
        Remove unnecessary properties from `record`.

        @return { object }
          A clean record.
    */
    op.cleanup = record =>
    {
        delete record.example;
        delete record.content;
        delete record.matter;
        delete record.overview;
        delete record.path;

        return record;
    }

    /**
        Parse `example` markdown content into `record`.

        Uses `config.toExampleFile` option to determine example file path if 
        `example` not set.

        @param { object } record
          - `example`: string content or filepath (consumed)
          - `path`: a path object
          - `uid`: indetifier for the record
        @return { object }
          - `matter`: front-matter attributes
          - `mcid`: markdown content id
    */
    op.example = async (record, exec) =>
    {
        record = await exec.identify(record);
        record = await exec.pather(record);

        let { example, path, uid } = record;        
        let data = { path: example || toExampleFile(path.path), uid };

        delete record.example;

        let results = await exec.markdown(data);

        if (results.mcid)
        {
            record.mcid = results.mcid;
            record.matter = results.matter;
        }

        return record;
    }
    

    /**
        Sets a UID value for a record.

        If the record already has a `name` or a `uid`, no change is made.

        @param { object } record
          - `path`: a path object
          - `tid`: asset type id
        @return { object }
          - `uid`: an identifier for the record
    */
    op.identify = async (record, exec) =>
    {
        if (!record.uid && !record.name)
        {
            record = await exec.pather(record);

            let { path, tid } = record;

            if (tid && is.nonao(path)) // no `uid` for sections
                record.uid = kebabCase(toAssetId(path.path));
        }

        return record;
    }


    /**
        Parses `content` for front-matter and HTML content.

        @param { object } record
          - `content`: markdown string content (consumed)
          - `path`: a path object
          - `name`: an identifier for `record` (sections)
          - `uid`: an identifier for `record` (assets)
        @return { object}
          - `matter`: front-matter attributes
          - `mcid`: markdown content id
    */
    op.markdown = async (record, exec) =>
    {
        record = await exec.identify(record);
        record = await exec.pather(record);

        let { content, name, path, uid = name } = record;

        if (!content && is.nonao(path))
            content = await fs.readFile(path.abs, 'utf8');

        delete record.content;

        if (content)
        {
            return ({ files, td }) => 
            {
                let mcid = pascalCase(`Article_${uid}`);
                let { doc, matter } = td.content.parse(content, { vars: { uid } });

                files[np.join(paths.components, 'articles', `${mcid}.svt`)] = doc;

                record.mcid = mcid;
                record.matter = matter;

                return record;
            }
        }

        return record;
    }


    /**
        Aplies `matter` options to `record`.

        @param { object } record
          - `matter`: markdown front-matter (consumed)
          - `tid`: asset type identifier
        @return { object}
          - `cobeMode`: default cobe display mode
          - `tags`: info-stamps
          - `title`: title for the record
          - `tocDepth`: ToC header level
    */
    op.options = record =>
    {
        let { matter, tid } = record;

        if (is.nonao(matter))
        {
            let { cobeMode, tags, title, tocDepth } = matter;

            if (tid === 'doc')
            {
                if (cobeMode) record.cobeMode = cobeMode;
                if (tags)
                {
                    record.tags ||= [];
                    record.tags.push(...(is.array(tags) ? tags : tags.split(commaRe)));
                }
                if (title) record.title = title;
                if (tocDepth || tocDepth === 0) record.tocDepth = tocDepth;
            }
            else if (!tid)
            {
                if (cobeMode) record.cobeMode = cobeMode;
                if (title) record.title ||= title;
                if (tocDepth || tocDepth === 0) record.tocDepth = tocDepth;
            }
        }

        delete record.matter;

        return record;
    }
    
    
    /**
        Parse `overview` markdown content into `record`.

        @param { object } record
          - `name`: a name for the record
          - `overview`: string content or filepath (consumed)
        @return { object }
          - `matter`: front-matter attributes
          - `mcid`: markdown content id
    */
    op.overview = async (record, exec) =>
    {
        let { name, overview } = record;

        let data = { name };

        if (fileRe.test(overview))
            data.path = overview.replace(fileRe, '');
        else
            data.content = overview;
        
        delete record.overview;

        let results = await exec.markdown(data);

        if (results.mcid)
        {
            record.mcid = results.mcid;
            record.matter = results.matter;
        }

        return record;
    }


    /**
        Resolves path information to its constituent parts.

        Relative paths are resolved from `config.root`.

        If `path` does not exist in the filesystem it is removed from `record`.

        @param { object } record 
          - `path`: a string path (consumed)
        @return { object }
          - `path`: a path object
     */
    op.pather = record =>
    {
        let { path } = record;

        if (is.string(path))
        {
            delete record.path;
            
            let abs = np.resolve(root, path);

            if (existsSync(abs))
            {
                let ext = np.extname(abs)
                let base = np.basename(abs, ext)
                
                record.path = { path, abs, base, ext };
            }
        }

        return record;
    }   


    /**
        Parses source file into `record`.

        @param { object } record
          - `path`: path object
        @return { object }
          All parsed data added.
    */
    op.source = async (record, exec) =>
    {
        record = await exec.pather(record);

        let { path } = record;

        if (is.nonao(path))
        {            
            return async ({ parsers, td }) =>
            {
                let parser = { ...parsers['*'], ...parsers[path.ext] };

                if (parser.use)
                {
                    let data = doxie(path.path, td.comment);
                    await parser.use(path.abs, data, docson);

                    if (data.ignore) return null;
                    Object.assign(record, data);
                }

                return record;
            }
        }

        return record;
    }


    /**
        Adds tag(s) to `record` as per configuration.

        @param { object } record
          - `tags`: info-stamps
          - `uid`: identifier for `record`
        @return { object }
          - `tags`: appended info-stamps
    */
    op.tag = async (record, exec) =>
    {
        record = await exec.identify(record);
        record = await exec.pather(record);

        let { mcid, path, tid, uid } = record;

        if (tagmap.size)
        {
            let promises = [];

            for (let [ fn, name ] of tagmap.entries())
            {
                let handler = info => 
                {
                    if (info)
                    {
                        let tag = info === `true` ? name : `${name}:${info}`;

                        record.tags ||= [];
                        record.tags.push(tag);

                        log.test(`tag {:emph:${tag}} was auto-assigned to asset {:emph:${uid}}`);
                    }
                }

                promises.push(Promise.resolve(fn({ mcid, path: { ...path }, tid, uid })).then(handler));
            }

            await Promise.all(promises);
        }

        return record;
    }


    /**
        Final call for adding a title to `record`.

        This will be the base filename for an asset or the name for a section.

        @param { object } record
          - `path`: a path object
          - `tid`: asset type identifier
        @return { object }
          - `title`: a title for the record
    */
    op.title = async (record, exec) =>
    {
        if (!record.tid) // section fallback
        {
            record.title ||= capitalCase(record.name);
        }
        else
        {
            record = await exec.pather(record);

            let { path } = record;

            if (is.nonao(path))
            {
                if (record.tid === 'doc') // doc asset fallback
                    record.title ||= capitalCase(path.base);
                else if (useFilenameOnly) // non-doc asset force filename
                    record.title = path.base;
                else // non-doc asset fallback
                    record.title ||= path.base;
            }
        }

        return record;
    }


    /**
        Tracks record with UID in master list.

        @param { object } record
          - `uid`: identifier for `record`
        @return { object }
          Asset record or `null` if asset already added.
    */
    op.track = async (record, exec) =>
    {
        record = await exec.identify(record);

        let { uid } = record;

        if (uid)
        {
            return ({ assets }) =>
            {
                if (assets[uid])
                {
                    log.warn(`duplicate asset {:emph:${uid}} was skipped`);
                    return null;
                }

                return assets[uid] = record;
            }
        }

        return record;
    }

    return op;
}
