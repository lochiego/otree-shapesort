function M(){}function it(t,e){for(const n in e)t[n]=e[n];return t}function J(t){return t()}function D(){return Object.create(null)}function v(t){t.forEach(J)}function K(t){return typeof t=="function"}function vt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function rt(t){return Object.keys(t).length===0}function st(t,...e){if(t==null)return M;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function $t(t,e,n){t.$$.on_destroy.push(st(e,n))}function Et(t,e,n,i){if(t){const r=Q(t,e,n,i);return t[0](r)}}function Q(t,e,n,i){return t[1]&&i?it(n.ctx.slice(),t[1](i(e))):n.ctx}function St(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const l=[],s=Math.max(e.dirty.length,r.length);for(let u=0;u<s;u+=1)l[u]=e.dirty[u]|r[u];return l}return e.dirty|r}return e.dirty}function kt(t,e,n,i,r,l){if(r){const s=Q(e,n,i,l);t.p(s,r)}}function Nt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function At(t){return t&&K(t.destroy)?t.destroy:M}let j=!1;function ot(){j=!0}function ct(){j=!1}function lt(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function ut(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let c=0;c<e.length;c++){const f=e[c];f.claim_order!==void 0&&o.push(f)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let o=0;o<e.length;o++){const c=e[o].claim_order,f=(r>0&&e[n[r]].claim_order<=c?r+1:lt(1,r,d=>e[n[d]].claim_order,c))-1;i[o]=n[f]+1;const _=f+1;n[_]=o,r=Math.max(_,r)}const l=[],s=[];let u=e.length-1;for(let o=n[r]+1;o!=0;o=i[o-1]){for(l.push(e[o-1]);u>=o;u--)s.push(e[u]);u--}for(;u>=0;u--)s.push(e[u]);l.reverse(),s.sort((o,c)=>o.claim_order-c.claim_order);for(let o=0,c=0;o<s.length;o++){for(;c<l.length&&s[o].claim_order>=l[c].claim_order;)c++;const f=c<l.length?l[c]:null;t.insertBefore(s[o],f)}}function at(t,e){t.appendChild(e)}function ft(t,e){if(j){for(ut(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Mt(t,e,n){j&&!n?ft(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function R(t){t.parentNode.removeChild(t)}function U(t){return document.createElement(t)}function dt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function W(t){return document.createTextNode(t)}function jt(){return W(" ")}function Ct(){return W("")}function F(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function zt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function _t(t){return Array.from(t.childNodes)}function ht(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function V(t,e,n,i,r=!1){ht(t);const l=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const u=t[s];if(e(u)){const o=n(u);return o===void 0?t.splice(s,1):t[s]=o,r||(t.claim_info.last_index=s),u}}for(let s=t.claim_info.last_index-1;s>=0;s--){const u=t[s];if(e(u)){const o=n(u);return o===void 0?t.splice(s,1):t[s]=o,r?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,u}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function X(t,e,n,i){return V(t,r=>r.nodeName===e,r=>{const l=[];for(let s=0;s<r.attributes.length;s++){const u=r.attributes[s];n[u.name]||l.push(u.name)}l.forEach(s=>r.removeAttribute(s))},()=>i(e))}function Lt(t,e,n){return X(t,e,n,U)}function Bt(t,e,n){return X(t,e,n,dt)}function mt(t,e){return V(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>W(e),!0)}function Ot(t){return mt(t," ")}function Pt(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Tt(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}let S;function pt(){if(S===void 0){S=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{S=!0}}return S}function Wt(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=U("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const r=pt();let l;return r?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",l=F(window,"message",s=>{s.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{l=F(i.contentWindow,"resize",e)}),at(t,i),()=>{(r||l&&i.contentWindow)&&l(),R(i)}}function It(t,e,n){t.classList[n?"add":"remove"](e)}let x;function b(t){x=t}function Y(){if(!x)throw new Error("Function called outside component initialization");return x}function qt(t){Y().$$.on_mount.push(t)}function Dt(t){Y().$$.after_update.push(t)}const w=[],H=[],N=[],G=[],Z=Promise.resolve();let P=!1;function tt(){P||(P=!0,Z.then(et))}function Ft(){return tt(),Z}function T(t){N.push(t)}const O=new Set;let k=0;function et(){const t=x;do{for(;k<w.length;){const e=w[k];k++,b(e),yt(e.$$)}for(b(null),w.length=0,k=0;H.length;)H.pop()();for(let e=0;e<N.length;e+=1){const n=N[e];O.has(n)||(O.add(n),n())}N.length=0}while(w.length);for(;G.length;)G.pop()();P=!1,O.clear(),b(t)}function yt(t){if(t.fragment!==null){t.update(),v(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(T)}}const A=new Set;let g;function Ht(){g={r:0,c:[],p:g}}function Gt(){g.r||v(g.c),g=g.p}function nt(t,e){t&&t.i&&(A.delete(t),t.i(e))}function gt(t,e,n,i){if(t&&t.o){if(A.has(t))return;A.add(t),g.c.push(()=>{A.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function Jt(t,e){gt(t,1,1,()=>{e.delete(t.key)})}function Kt(t,e,n,i,r,l,s,u,o,c,f,_){let d=t.length,m=l.length,h=d;const C={};for(;h--;)C[t[h].key]=h;const $=[],z=new Map,L=new Map;for(h=m;h--;){const a=_(r,l,h),p=n(a);let y=s.get(p);y?i&&y.p(a,e):(y=c(p,a),y.c()),z.set(p,$[h]=y),p in C&&L.set(p,Math.abs(h-C[p]))}const I=new Set,q=new Set;function B(a){nt(a,1),a.m(u,f),s.set(a.key,a),f=a.first,m--}for(;d&&m;){const a=$[m-1],p=t[d-1],y=a.key,E=p.key;a===p?(f=a.first,d--,m--):z.has(E)?!s.has(y)||I.has(y)?B(a):q.has(E)?d--:L.get(y)>L.get(E)?(q.add(y),B(a)):(I.add(E),d--):(o(p,s),d--)}for(;d--;){const a=t[d];z.has(a.key)||o(a,s)}for(;m;)B($[m-1]);return $}function Qt(t){t&&t.c()}function Rt(t,e){t&&t.l(e)}function wt(t,e,n,i){const{fragment:r,on_mount:l,on_destroy:s,after_update:u}=t.$$;r&&r.m(e,n),i||T(()=>{const o=l.map(J).filter(K);s?s.push(...o):v(o),t.$$.on_mount=[]}),u.forEach(T)}function bt(t,e){const n=t.$$;n.fragment!==null&&(v(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function xt(t,e){t.$$.dirty[0]===-1&&(w.push(t),tt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Ut(t,e,n,i,r,l,s,u=[-1]){const o=x;b(t);const c=t.$$={fragment:null,ctx:null,props:l,update:M,not_equal:r,bound:D(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:D(),dirty:u,skip_bound:!1,root:e.target||o.$$.root};s&&s(c.root);let f=!1;if(c.ctx=n?n(t,e.props||{},(_,d,...m)=>{const h=m.length?m[0]:d;return c.ctx&&r(c.ctx[_],c.ctx[_]=h)&&(!c.skip_bound&&c.bound[_]&&c.bound[_](h),f&&xt(t,_)),d}):[],c.update(),f=!0,v(c.before_update),c.fragment=i?i(c.ctx):!1,e.target){if(e.hydrate){ot();const _=_t(e.target);c.fragment&&c.fragment.l(_),_.forEach(R)}else c.fragment&&c.fragment.c();e.intro&&nt(t.$$.fragment),wt(t,e.target,e.anchor,e.customElement),ct(),et()}b(o)}class Vt{$destroy(){bt(this,1),this.$destroy=M}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!rt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{M as A,Et as B,kt as C,Nt as D,St as E,ft as F,$t as G,dt as H,Bt as I,T as J,It as K,Wt as L,Kt as M,At as N,K as O,Jt as P,H as Q,Vt as S,jt as a,Mt as b,Ot as c,Gt as d,Ct as e,nt as f,Ht as g,R as h,Ut as i,Dt as j,U as k,Lt as l,_t as m,zt as n,qt as o,Tt as p,W as q,mt as r,vt as s,gt as t,Pt as u,Qt as v,Rt as w,wt as x,bt as y,Ft as z};
