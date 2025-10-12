import { capitalCase, kebabCase, pascalCase } from 'change-case'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import np from 'node:path'
import globit from '#lib/globit.js'
import pathTransformer from '#lib/path-transformer.js'
import pathy from '#lib/pathy.js'
import paths from '#paths'
import { ident, is, nil } from '#utils'
import docson from '../docson.js'
import doxie from '../doxie/index.js'


let commaRe = /\s*,\s*/;
let fileRe = /^file:\//;

export default function(config)
{
    let { assetTypes, root, tagLegend, useFilenameOnly } = config;  

    let toPathObj = pathy(root);
    let types = Object.entries(assetTypes);
    let tagmap = new Map();

    let toAssetAccessLine = pathTransformer(config.toAssetAccessLine) || nil;
    let toAssetId = pathTransformer(config.toAssetId) || ident;
    let toAssetName = pathTransformer(config.toAssetName) || ident;
    let toExampleFile = pathTransformer(config.toExampleFile) || nil;

    Object.entries(tagLegend).forEach(([ key, val ]) => val.assign && tagmap.set(val.assign, key));

    let op = {};


    /**
        Sets a an access line for an asset (if not already present).

        @param { object } record
          - `path`: a path object
        @return { object }
          - `accessLine`: an string access line for the record
    */
    op.access = async (record, exec) =>
    {
        if (!record.accessLine)
        {
            record = await exec.pather(record);

            let { path } = record;

            if (is.nonao(path)) 
            {
                let line = toAssetAccessLine(path);
                if (line) record.accessLine = line;
            }
        }

        return record;
    }


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

        return async ({ assemble, assets }) =>
        {
            record.assets = [];

            let mapType = async ([ tid, { plural, singular } ]) => 
            {
                let mapFile = async path =>
                {
                    let asset = await assemble[singular]({ path, section: name, tid });

                    if (asset)
                    {
                        let { uid } = asset;

                        if (assets[uid])
                            log.warn(`duplicate asset {:emph:${uid}} was skipped`);
                        else
                            (record.assets.push(uid), assets[uid] = asset);
                    }
                }

                await globit(record[plural], root).then(files => Promise.all(files.map(mapFile)));

                delete record[plural];
            }

            return Promise.all(types.map(mapType)).then(() => record);
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
        Parse `example` markdown content into asset `record`.

        Uses `config.toExampleFile` option to determine example file path if 
        `example` not set.

        @param { object } record
          - `example`: string content or filepath (consumed)
          - `path`: a path object
          - `uid`: indetifier for the record
        @return { object }
          - `mcid`: markdown content id
          - relevant front-matter data (if available)
    */
    op.example = async (record, exec) =>
    {
        record = await exec.pather(record);

        let { example, path, uid } = record;        
        let data = { path: example || toExampleFile(path), uid };

        delete record.example;

        let { mcid, matter } = await exec.markdown(data);

        if (mcid) record.mcid = mcid;
        if (is.nonao(matter))
        {
            let { cobeMode } = matter;
            
            if (cobeMode) record.cobeMode = cobeMode;
        }

        return record;
    }
    

    /**
        Sets a UID value for a record (if not already present).

        Only affects records with a `tid` value.

        @param { object } record
          - `path`: a path object
        @return { object }
          - `uid`: an identifier for the record
    */
    op.identify = async (record, exec) =>
    {
        if (!record.uid)
        {
            record = await exec.pather(record);

            let { path } = record;

            if (is.nonao(path)) 
            {
                let uid = toAssetId(path);
                if (uid) record.uid = kebabCase(uid);
            }
        }

        return record.uid ? record : null;
    }


    /**
        Parses `content` for front-matter and HTML content.

        @param { object } record
          - `content`: markdown string content (consumed)
          - `path`: a path object
          - `uid`: an identifier for `record`
        @return { object}
          - `matter`: front-matter attributes
          - `mcid`: markdown content id
    */
    op.markdown = async (record, exec) =>
    {
        record = await exec.pather(record);

        let { content, path, uid } = record;

        if (!content && is.nonao(path))
            content = await fs.readFile(path.path, 'utf8');

        delete record.content;

        if (content)
        {
            return ({ files, md }) => 
            {
                let mcid = pascalCase(`Article_${uid}`);
                let { doc, matter } = md.content(content, { vars: { uid } });

                files[np.join(paths.components, 'articles', `${mcid}.svt`)] = doc;

                record.mcid = mcid;
                record.matter = matter;

                return record;
            }
        }

        return record;
    }


    /**
        Parse markdown content into document `record`.

        @param { object } record
          - `name`: a name for the record
          - `overview`: string content or filepath (consumed)
        @return { object }
          - `mcid`: markdown content id
          - relevant front-matter data (if available)
    */
    op.options = (record, exec) =>
    {
        let data = {};

        if (record.tid)
        {
            let { path, uid } = record;
            data = { path, uid };
        }
        else // section
        {
            let { name, overview } = record;

            data.uid = name;

            if (fileRe.test(overview))
                data.path = overview.replace(fileRe, '');
            else
                data.content = overview;
            
            delete record.overview;
        }

        return async ({ md }) =>
        {
            let { mcid, matter } = await exec.markdown(data);

            if (mcid) record.mcid = mcid;
            if (is.nonao(matter))
            {
                let { cobeMode, deprecated, title, tags, tocDepth } = matter;

                if (cobeMode) record.cobeMode = cobeMode;

                if (deprecated) 
                {
                    record.deprecated = deprecated;
                    if (is.string(deprecated)) 
                        record.deprecated = md.comment(deprecated).doc;
                }
                
                if (title) record.title = title;
                if (tocDepth || tocDepth === 0) record.tocDepth = tocDepth;

                if (record.tid)
                {
                    if (is.string(tags)) tags = tags.split(commaRe);
                    if (is.array(tags)) (record.tags ||= []).push(...tags);
                }
            }

            return record;
        }
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
            record.path = toPathObj(record.path);

        return record;
    }   


    /**
        Parses source file documentation data into `record`.

        If parsed data includes `name` and not `title` then `title` becomes 
        `name`.

        @param { object } record
          - `path`: a path object for the source file
          - `tid`: asset type id
        @return { object }
          All parsed data added.
    */
    op.source = async (record, exec) =>
    {
        record = await exec.pather(record);

        let { path, tid } = record;

        if (is.nonao(path))
        {            
            return async ({ parsers, md }) =>
            {
                let parser = { ...parsers['*'], ...parsers[path.ext] };

                if (parser.use)
                {
                    let doxer = doxie[tid](path.sub, md.comment);
                    // doxer validates all data from parser
                    doxer.asset = await parser.use(path.path, docson);

                    let { ignore, name, ...rest } = doxer.asset;

                    if (ignore) return null;
                    if (name) rest.title ||= name;

                    Object.assign(record, rest);
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
        record = await exec.pather(record);

        if (tagmap.size)
        {
            let promises = [];

            let { path, tid, uid } = record;
            let data = { path: { ...path }, tid, uid };

            for (let [ fn, name ] of tagmap.entries())
            {
                let handler = info => 
                {
                    if (info)
                    {
                        let tag = info === true ? name : `${name}:${info}`;

                        record.tags ||= [];
                        record.tags.push(tag);

                        log.test(`tag {:emph:${tag}} was auto-assigned to asset {:emph:${uid}}`);
                    }
                }

                promises.push(Promise.resolve(fn(data)).then(handler));
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
        if (record.tid) // section fallback
        {
            record = await exec.pather(record);

            let { path } = record;

            if (is.nonao(path))
            {
                if (record.tid === 'doc') // doc asset fallback
                    record.title ||= capitalCase(toAssetName(path));
                else if (useFilenameOnly) // non-doc asset force filename
                    record.title = toAssetName(path);
                else // non-doc asset fallback
                    record.title ||= toAssetName(path);
            }
        }
        else
        {
            record.title ||= capitalCase(record.name);
        }

        return record;
    }


    return op;
}
