
export default function(stats)
{
    let { bundleSize, bundleOrigSize, bundleReduction, moduleCount } = stats;

    let kb = Math.round(bundleSize / 1024 * 100) / 100;
    let ogkb = Math.round(bundleOrigSize / 1024 * 100) / 100;

    log(
    `
    ::::::::::::::::::::::::::::::::::::::::::::::::::::::
         ACID Web Bundle Stats
    ::::::::::::::::::::::::::::::::::::::::::::::::::::::
           {:greenBright:bundle size:      ${kb}kb}
           original size:    ${ogkb}kb
           code reduction:   ${bundleReduction}%
           module count:     ${moduleCount}
    ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    `);

    // log(stats.modules);
}
