const hexCol1 = document.getElementById('hexCol1');
const hexCol2 = document.getElementById('hexCol2');
const hexCol3 = document.getElementById('hexCol3');

const hexChars = '0123456789ABCDEF';
const machineChars = '.@...#.........^...&..-*.)_-+=...%...$...<.>.?.|.a..b.(..c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.......H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z.0123456789';

const highlights = [
    'white_rabbit',
    'follow the path',
    'matrix',
    'neo',
    'reverse code',
    'whisper',
    '42',
    'fortune',
    'telnet'
];

function generateLine(lineNum) {
    let line1 = lineNum.toString(16).toUpperCase().padStart(7, '0') + ' ';
    let line2 = '';
    for (let i = 0; i < 8; i++) {
        line2 += hexChars[Math.floor(Math.random() * hexChars.length)];
        line2 += hexChars[Math.floor(Math.random() * hexChars.length)];
        line2 += ' ';
    }

    let line3 = '';
    let isHighlight = false;
    if (Math.random() < 0.01) {
        const hint = highlights[Math.floor(Math.random() * highlights.length)];
        line3 = hint + machineChars.slice(hint.length, 16);
        isHighlight = true;
    } else {
        for (let i = 0; i < 16; i++) {
            line3 += machineChars[Math.floor(Math.random() * machineChars.length)];
        }
    }

    return { line1, line2, line3, isHighlight };
}

let lineNum = 0;
for (let i = 0; i < 50; i++) {
    const { line1, line2, line3, isHighlight } = generateLine(lineNum++);
    const div1 = document.createElement('div'); div1.textContent = line1; hexCol1.appendChild(div1);
    const div2 = document.createElement('div'); div2.textContent = line2; hexCol2.appendChild(div2);
    const div3 = document.createElement('div'); div3.textContent = line3;
    if (isHighlight) div3.classList.add('highlight');
    hexCol3.appendChild(div3);
}

hexCol1.scrollTop = hexCol1.scrollHeight;
hexCol2.scrollTop = hexCol2.scrollHeight;
hexCol3.scrollTop = hexCol3.scrollHeight;

setInterval(() => {
    const { line1, line2, line3, isHighlight } = generateLine(lineNum++);
    const div1 = document.createElement('div'); div1.textContent = line1; hexCol1.appendChild(div1); hexCol1.removeChild(hexCol1.children[0]);
    const div2 = document.createElement('div'); div2.textContent = line2; hexCol2.appendChild(div2); hexCol2.removeChild(hexCol2.children[0]);
    const div3 = document.createElement('div'); div3.textContent = line3;
    if (isHighlight) div3.classList.add('highlight');
    hexCol3.appendChild(div3); hexCol3.removeChild(hexCol3.children[0]);

    hexCol1.scrollTop = hexCol1.scrollHeight;
    hexCol2.scrollTop = hexCol2.scrollHeight;
    hexCol3.scrollTop = hexCol3.scrollHeight;
}, 200);
