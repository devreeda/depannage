/* Tables de saturation — pressions en bar(g), d'après tables constructeur
   R448A/R449A : Honeywell/Chemours (relevés CoolProp, recoupés constructeur)
   R744 : CoolProp                                                            */
const PT_TABLES = {
  R448A: [
    [-40,0.34,-0.02],[-35,0.68,0.25],[-30,1.08,0.58],[-25,1.55,0.96],
    [-20,2.10,1.42],[-15,2.73,1.95],[-10,3.45,2.57],[-5,4.28,3.28],
    [0,5.22,4.09],[5,6.28,5.02],[10,7.46,6.07],[15,8.79,7.26],
    [20,10.26,8.59],[25,11.89,10.07],[30,13.68,11.72],[35,15.66,13.56],
    [40,17.82,15.59],[45,20.18,17.83],[50,22.75,20.29],[55,25.54,23.01]
  ],
  R744: [
    [-40,9.03],[-35,11.01],[-30,13.27],[-25,15.82],[-20,18.69],
    [-15,21.90],[-10,25.48],[-5,29.45],[0,33.84],[5,38.68],
    [10,44.01],[15,49.86],[20,56.28],[25,63.33],[30,71.13]
  ]
};

/* température de saturation pour une pression donnée (bar g) */
function tSat(ref, p, phase) {
  const t = PT_TABLES[ref];
  if (!t || p == null) return null;
  const idx = ref === 'R744' ? 1 : (phase === 'bubble' ? 1 : 2);
  if (p < t[0][idx] || p > t[t.length - 1][idx]) return null;
  for (let i = 0; i < t.length - 1; i++) {
    const a = t[i], b = t[i + 1];
    if (p >= a[idx] && p <= b[idx]) {
      const f = (p - a[idx]) / (b[idx] - a[idx]);
      return a[0] + f * (b[0] - a[0]);
    }
  }
  return null;
}
