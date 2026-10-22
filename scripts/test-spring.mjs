import assert from 'node:assert/strict';
import {springStep, exponentialFollow, isSettled} from '../assets/runtime/spring.mjs';

function near(a, b, tolerance = 1e-9) { assert.ok(Math.abs(a-b) <= tolerance, `${a} != ${b}`); }
function run(hz, zeta, retarget = false) {
  let state = {x: 0, v: 0};
  for (let i = 0; i < hz; i++) {
    state = springStep(state, retarget && i >= hz / 2 ? -0.4 : 1, 1 / hz, {omega: 18, zeta});
  }
  return state;
}

for (const zeta of [0, 0.72, 1, 1.4]) {
  for (const retarget of [false, true]) {
    const a = run(30, zeta, retarget);
    for (const hz of [60, 120]) {
      const b = run(hz, zeta, retarget); near(a.x,b.x); near(a.v,b.v);
    }
  }
  const initial = {x: 0.3, v: -2};
  const one = springStep(initial, 1, 0.4, {omega: 18, zeta});
  const two = springStep(springStep(initial,1,0.13,{omega:18,zeta}),1,0.27,{omega:18,zeta});
  near(one.x,two.x); near(one.v,two.v);
}
let critical = {x: 0, v: 0};
for (let i=0;i<120;i++) {
  const old=critical.x; critical=springStep(critical,1,1/120,{omega:24,zeta:1});
  assert.ok(critical.x >= old && critical.x <= 1);
}
assert.ok(isSettled(critical,1));
let under = {x:0,v:0}, peak=0;
for (let i=0;i<240;i++) { under=springStep(under,1,1/120,{omega:18,zeta:0.72}); peak=Math.max(peak,under.x); }
assert.ok(peak > 1.03 && peak < 1.05); assert.ok(isSettled(under,1));
near(peak,1+Math.exp(-Math.PI*0.72/Math.sqrt(1-0.72**2)),0.0001);
near(springStep({x:0,v:0},1,0.1,{omega:24,zeta:1}).x,1-(1+2.4)*Math.exp(-2.4));
assert.deepEqual(springStep({x:3,v:7},2,0,{omega:24,zeta:1}),{x:3,v:7});
assert.ok(isSettled(springStep({x:0,v:0},1,10,{omega:24,zeta:1}),1));
assert.throws(()=>springStep({x:0,v:0},1,-1,{omega:24,zeta:1}),RangeError);
assert.throws(()=>springStep({x:NaN,v:0},1,1,{omega:24,zeta:1}),RangeError);
assert.throws(()=>springStep({x:0,v:0},1,1,{omega:0,zeta:1}),RangeError);
for (const hz of [30,60,120]) { let x=0; for(let i=0;i<hz;i++) x=exponentialFollow(x,1,5,1/hz); near(x,1-Math.exp(-5)); }
console.log('PASS: 30/60/120 Hz, retargeting, analytic composition, critical monotonicity, overshoot, settle, zero/long dt, invalid inputs, exponential follow.');
