import { capitalCase, kebabCase, pascalCase } from 'change-case'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import np from 'node:path'
import paths from '#paths'
import { is, uid } from '#utils'


/*
    Generates routines for creating document assets.
*/
export default function(config)
{
    let { root, toAssetId } = config;

    let commaRe = /\s*,\s*/;
    let doc = {};

    /**
        Loads file `path` if present and there is no `content`.

        @param { object } record
          - `content`: string content
          - `path`: a file path
        @return { object }
          - `markdown`: string content
    */
    doc.markdown = async record =>
    {
        let { content, path } = record;

        record.markdown = content;

        if (!content && is.string(path))
        {
            let abspath = np.resolve(root, path);
            
            if (existsSync(abspath))
                record.markdown = await fs.readFile(abspath, 'utf8');
        }

        return record;
    }

    /**
        Adds config options from front matter.

        @param { object } record
          - `content`: markdown content
        @return { object}
          With config options applied.
    */
    doc.options = record =>
    {
        let { markdown } = record;

        if (is(markdown))
        {
            return ({ td }) =>
            {
                let fm = td.parseMeta(markdown);

                if (fm)
                {
                    if (fm.cobeMode) record.cobeMode = fm.cobeMode;
                    if (fm.title) record.title ||= fm.title;
                    if (fm.tags) record.tags ||= is.array(fm.tags) ? fm.tags : fm.tags.split(commaRe);
                    if (fm.tocDepth || fm.tocDepth === 0) record.tocDepth = fm.tocDepth;
                }

                return record;
            }
        }

        return record;
    }

    /**
        Identifies the document asset.

        The `tid` is added only if `section` is present.

        @param { object } record
          - `path`: file path
          - `section`: parent section
          - `title`: document title
        @return { object}
          - `tid`: "doc" (if not already present)
          - `title`: document title (if not already present)
          - `uid`: unique id (if not already present)
    */
    doc.identify = record =>
    {
        let { path, section } = record;

        if (section) record.tid ||= 'doc';

        if (path)
        {
            record.title ||= capitalCase(np.basename(path, np.extname(path)));
            record.uid ||= kebabCase(toAssetId(path));
        }
        else
        {
            record.title ||= 'Untitled';
            record.uid ||= kebabCase(uid.hex([ record.title, section ]));
        }

        return record;
    }

    /**
        Parses markdown content, and maps it in `files`.

        @param { object } record
          - `markdown`: markdown content
          - `uid`: document identifier
        @return { object}
          - `mcid`: content id
          - `file`: virtual pathname for parsed `markdown`
          - `html`: converted markdown
    */
    doc.parse = record =>
    {
        let { markdown, uid } = record;
                
        if (is(markdown))
        {
            return ({ files, td }) => 
            {
                record.mcid = pascalCase(`Article_${uid}`);

                let file = np.join(paths.components, 'articles', `${record.mcid}.svt`);
                let html = td.parse(markdown, { vars: { uid } }).doc;

                files[file] = html;

                return record;
            }
        }

        return record;
    }

    /**
        Remove properties not needed in bundle.

        This should be the last step called.

        @return { object }
          A clean record.
    */
    doc.cleanup = record =>
    {
        delete record.content;
        delete record.markdown;
        delete record.path;

        return record;
    }

    return doc;
}
