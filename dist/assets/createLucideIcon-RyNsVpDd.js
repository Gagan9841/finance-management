import{P as h}from"./index-CRdMBJfa.js";import{d as p,c as f,o as w,w as m,r as C,u as g,$ as i}from"./index-CtMJMLFj.js";const _=p({__name:"VisuallyHidden",props:{feature:{default:"focusable"},asChild:{type:Boolean},as:{default:"span"}},setup(a){return(e,t)=>(w(),f(g(h),{as:e.as,"as-child":e.asChild,"aria-hidden":e.feature==="focusable"?"true":void 0,"data-hidden":e.feature==="fully-hidden"?"":void 0,tabindex:e.feature==="fully-hidden"?"-1":void 0,style:{position:"absolute",border:0,width:"1px",height:"1px",padding:0,margin:"-1px",overflow:"hidden",clip:"rect(0, 0, 0, 0)",clipPath:"inset(50%)",whiteSpace:"nowrap",wordWrap:"normal"}},{default:m(()=>[C(e.$slots,"default")]),_:3},8,["as","as-child","aria-hidden","data-hidden","tabindex"]))}});/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),b=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,o)=>o?o.toUpperCase():t.toLowerCase()),v=a=>{const e=b(a);return e.charAt(0).toUpperCase()+e.slice(1)},k=(...a)=>a.filter((e,t,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var r={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=({size:a,strokeWidth:e=2,absoluteStrokeWidth:t,color:o,iconNode:l,name:s,class:x,...c},{slots:d})=>i("svg",{...r,width:a||r.width,height:a||r.height,stroke:o||r.stroke,"stroke-width":t?Number(e)*24/Number(a):e,class:k("lucide",...s?[`lucide-${n(v(s))}-icon`,`lucide-${n(s)}`]:["lucide-icon"]),...c},[...l.map(u=>i(...u)),...d.default?[d.default()]:[]]);/**
 * @license lucide-vue-next v0.513.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=(a,e)=>(t,{slots:o})=>i($,{...t,iconNode:e,name:a},o);export{_,A as c};
