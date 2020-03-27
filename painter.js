/*
TODO - disable file_unique_origin:
https://stackoverflow.com/questions/51081754/cross-origin-request-blocked-when-loading-local-file
*/

// const url = 'https://ae01.alicdn.com/kf/HTB1guYMHFXXXXbxaXXXq6xXFXXXi/Professional-Artist-Hand-painted-High-Quality-Classical-Lady-Portrait-Oil-Painting-On-Canvas-Classical-Oil-Painting.jpg';
// const url = './Painting.jpg';
const url = './Painting-small.jpg';

// const presets = ['posterized2', 'smoothed'];
// const presets = ['default', 'posterized1', 'posterized2', 'posterized3', 'curvy',
//     'sharp', 'detailed', 'smoothed', 'grayscale', 'fixedpalette', 'randomsampling1',
//     'randomsampling2', 'artistic1', 'artistic2', 'artistic3', 'artistic4'
// ];

window.onload = async function() {
    document.querySelector('img').src = url;

    // await makeSvg({ numberofcolors: 4, blurradius: 5 });
    await makeSvg({ numberofcolors: 4, blurradius: 5, blurdelta: 50 });
    await makeSvg({ numberofcolors: 4, blurradius: 5, blurdelta: 50, colorsampling: 1 });

    // for (let preset of presets)
    //     await makeSvg(preset);
};

async function rangeToLoop(callback, args, grainCount = 4) {
    const arrKey = Object.keys(args).find(key => Array.isArray(args[key]));
    if (arrKey) {
        const arrArg = args[arrKey];
        const delta = (arrArg[1] - arrArg[0]) / (grainCount - 1);
        for (let i = arrArg[0]; i <= arrArg[1]; i += delta) {
            const iArgs = Object.assign({}, args);
            iArgs[arrKey] = toFixedNumber(i, 2);
            await rangeToLoop(iArgs);
        }
    } else
        return callback(args);
}

async function makeSvg(options) {
    const id = JSON.stringify(options);

    const arrKey = Object.keys(options).find(key => Array.isArray(options[key]));
    if (arrKey) {
        const arrArg = options[arrKey];
        const delta = (arrArg[1] - arrArg[0]) / 3;
        for (let i = arrArg[0]; i <= arrArg[1]; i += delta) {
            const iArgs = Object.assign({}, options);
            iArgs[arrKey] = toFixedNumber(i, 2);
            await makeSvg(iArgs);
        }
    } else {
        return new Promise(function(resolve) {
            console.log(`making ${id}...`);
            const eDiv = document.createElement("DIV");
            eDiv.id = id;
            eDiv.innerHTML = `<p>${id}</p>`;
            document.body.appendChild(eDiv);
            ImageTracer.imageToSVG(url, function(svgstr) {
                ImageTracer.appendSVGString(svgstr, id);
                resolve();
            }, options);
        });
    }
}

function toFixedNumber(num, digits, base = 10) {
    const pow = Math.pow(base || 10, digits);
    return Math.round(num * pow) / pow;
}
