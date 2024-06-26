import { bench, group, run } from "mitata";
import Jimp from "jimp-compact";
import { Image } from "imagescript";
import Sharp from "sharp";
import { Canvas as NapiCanvas } from "canvas-constructor/napi-rs";
import { readPackageJSON } from "pkg-types";

import { noop, type Versions } from "./util";

const { dependencies } = (await readPackageJSON()) as unknown as {
	dependencies: Versions;
};

group("1000x1000 (black) (png)", () => {
	bench(`jimp-compact ${dependencies["jimp-compact"]}`, () =>
		Jimp.read(1000, 1000, 0x000000ff).then((x) =>
			x.getBuffer("image/png", noop),
		),
	);
	bench(`imagescript ${dependencies.imagescript}`, () =>
		new Image(1000, 1000).fill(0x000000ff).encode(),
	);
	bench(`sharp ${dependencies.sharp}`, () =>
		Sharp({
			create: {
				width: 1000,
				height: 1000,
				channels: 4,
				background: {
					r: 0,
					g: 0,
					b: 0,
					alpha: 1,
				},
			},
		})
			.png()
			.toBuffer(),
	);
	bench(`canvas-constructor, napi-rs ${dependencies["@napi-rs/canvas"]}`, () =>
		new NapiCanvas(1000, 1000).png(),
	);
	// bench("Black image 1000x1000 (canvas-constructor, skia)", () =>
	// 	new SkiaCanvas(1000, 1000).png(),
	// );
	// bench("Black image 1000x1000 (canvas-constructor, cairo)", () =>
	// 	new CairoCanvas(1000, 1000).png(),
	// );
});

group("2000x2000 (black) (png)", () => {
	bench(`jimp-compact ${dependencies["jimp-compact"]}`, () =>
		Jimp.read(2000, 2000, 0x000000ff).then((x) =>
			x.getBuffer("image/png", noop),
		),
	);
	bench(`imagescript ${dependencies.imagescript}`, () =>
		new Image(2000, 2000).fill(0x000000ff).encode(),
	);
	bench(`sharp ${dependencies.sharp}`, () =>
		Sharp({
			create: {
				width: 2000,
				height: 2000,
				channels: 4,
				background: {
					r: 0,
					g: 0,
					b: 0,
					alpha: 1,
				},
			},
		})
			.png()
			.toBuffer(),
	);
	bench(`canvas-constructor, napi-rs ${dependencies["@napi-rs/canvas"]}`, () =>
		new NapiCanvas(2000, 2000).png(),
	);
	// bench("Black image 2000x2000 (canvas-constructor, skia)", () =>
	// 	new SkiaCanvas(2000, 2000).png(),
	// );
});

run({
	json: true,
	silent: true,
}).then((o) =>
	Bun.write(
		"./result.json",
		Buffer.from(JSON.stringify(o.benchmarks), "utf-8"),
	),
);

await run({
	silent: false, // enable/disable stdout output
	avg: true, // enable/disable avg column (default: true)
	json: false, // enable/disable json output (default: false)
	colors: true, // enable/disable colors (default: true)
	min_max: true, // enable/disable min/max column (default: true)
	percentiles: false, // enable/disable percentiles column (default: true)
}).then(console.log);
