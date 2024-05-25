import {run, bench, group} from 'mitata';
import Jimp from "jimp-compact";
import {Image} from "imagescript";
import Sharp from "sharp";


group("1000x1000 (black) (png)", () => {
    bench("Black image 1000x1000 (jimp-compact)",
        () => Jimp.read(1000, 1000, 0x000000ff))
    bench("Black image 1000x1000 (imagescript)",
        () => new Image(1000, 1000).fill(0x000000ff))
    bench("Black image 1000x1000 (sharp)",
        () => Sharp().clone().resize(1000, 1000).tint("#000000"))
})

group("2000x2000 (black) (png)", () => {
    bench("Black image 2000x2000 (jimp-compact)",
        () => Jimp.read(2000, 2000, 0x00000ff))
    bench("Black image 2000x2000 (imagescript)",
        () => new Image(2000, 2000).fill(0x00000ff))
    bench("Black image 2000x2000 (sharp)",
        () => Sharp({
            create: {
                width: 2000,
                height: 2000,
                channels: 4,
                background: {
                    r: 0,
                    g: 0,
                    b: 0,
                    alpha: 1
                }
            }
        }))
})

run({
    json: true,
    silent: true
}).then(o => Bun.write("./result.json", Buffer.from(JSON.stringify(o.benchmarks), "utf-8")))

await run({
    silent: false, // enable/disable stdout output
    avg: true, // enable/disable avg column (default: true)
    json: false, // enable/disable json output (default: false)
    colors: true, // enable/disable colors (default: true)
    min_max: true, // enable/disable min/max column (default: true)
    percentiles: false, // enable/disable percentiles column (default: true)
});