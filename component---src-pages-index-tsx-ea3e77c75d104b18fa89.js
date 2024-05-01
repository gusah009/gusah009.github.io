"use strict";(self.webpackChunkgatsby_starter_default=self.webpackChunkgatsby_starter_default||[]).push([[348],{7140:function(e){var t="%[a-f0-9]{2}",r=new RegExp("("+t+")|([^%]+?)","gi"),n=new RegExp("("+t+")+","gi");function a(e,t){try{return[decodeURIComponent(e.join(""))]}catch(o){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],a(r),a(n))}function o(e){try{return decodeURIComponent(e)}catch(o){for(var t=e.match(r)||[],n=1;n<t.length;n++)t=(e=a(t,n).join("")).match(r)||[];return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var r={"%FE%FF":"��","%FF%FE":"��"},a=n.exec(e);a;){try{r[a[0]]=decodeURIComponent(a[0])}catch(t){var i=o(a[0]);i!==a[0]&&(r[a[0]]=i)}a=n.exec(e)}r["%C2"]="�";for(var s=Object.keys(r),c=0;c<s.length;c++){var l=s[c];e=e.replace(new RegExp(l,"g"),r[l])}return e}(e)}}},9600:function(e){e.exports=function(e,t){for(var r={},n=Object.keys(e),a=Array.isArray(t),o=0;o<n.length;o++){var i=n[o],s=e[i];(a?-1!==t.indexOf(i):t(i,s,e))&&(r[i]=s)}return r}},5456:function(e,t,r){r.r(t),r.d(t,{default:function(){return g}});var n=r(1504),a=r(6920),o=r(1712);var i=function(e){let{profileImage:t}=e;return(0,o.im)(a.G,{className:" w-20 h-20 md:w-32 md:h-32 mb-8 rounded-full",image:t,alt:"Profile Image"})};var s=function(e){let{profileImage:t}=e;return(0,o.im)("div",{className:"w-full bg-gradient-to-bl from-gray-700 via-gray-900 to-black text-white"},(0,o.im)("div",{className:"flex flex-col justify-center items-start w-full h-72 md:w-[725px] lg:w-[840px] md:h-96 m-auto px-5 md:px-0"},(0,o.im)(i,{profileImage:t}),(0,o.im)("div",null,(0,o.im)("div",{className:" text-sm md:text-xl font-semibold"},"안녕하세요!"),(0,o.im)("div",{className:"mt-1 flex flex-wrap whitespace-pre text-2xl md:text-3xl font-semibold"},"항상",(0,o.im)("div",{className:" text-blue-300 "},' "왜?" '),"를 고민하는 개발자 정현모입니다."))))},c=r(5072),l=r(5648);var u=function(e){let{title:t,date:r,categories:n,summary:i,thumbnail:{childImageSharp:{gatsbyImageData:s}},link:c}=e;return(0,o.im)(l.cH,{to:c,className:"flex flex-col rounded-lg shadow-md cursor-pointer hover:shadow-lg"},(0,o.im)(a.G,{className:"w-full h-44 rounded-lg object-cover",image:s,alt:"Post Item Image"}),(0,o.im)("div",{className:" flex-1 flex flex-col p-4"},(0,o.im)("div",{className:"h-14 overflow-hidden mb-1 text-ellipsis whitespace-normal break-words text-xl font-bold line-clamp-2"},t),(0,o.im)("div",{className:"text-sm font-normal opacity-70"},r),(0,o.im)("div",{className:"flex flex-wrap my-2 space-x-1"},n.map((e=>(0,o.im)("div",{className:"my-0.5 py-1 px-2 rounded-md bg-teal-700 text-sm font-semibold text-white",key:e},e)))),(0,o.im)("div",{className:"h-12 overflow-hidden mt-auto text-ellipsis whitespace-normal break-words text-base opacity-80 line-clamp-2"},i)))};var m=function(e,t){const r=(0,n.useRef)(null),a=(0,n.useRef)(null),{0:o,1:i}=(0,n.useState)(1),s=(0,n.useMemo)((()=>t.filter((t=>{let{node:{frontmatter:{categories:r}}}=t;return"All"===e||r.includes(e)}))),[e]);return(0,n.useEffect)((()=>{a.current=new IntersectionObserver(((e,t)=>{e[0].isIntersecting&&(i((e=>e+1)),t.unobserve(e[0].target))}))}),[]),(0,n.useEffect)((()=>i(1)),[e]),(0,n.useEffect)((()=>{10*o>=s.length||null===r.current||0===r.current.children.length||null===a.current||a.current.observe(r.current.children[r.current.children.length-1])}),[o,e]),{containerRef:r,postList:s.slice(0,10*o)}};var p=function(e){let{selectedCategory:t,posts:r}=e;const{containerRef:n,postList:a}=m(t,r);return(0,o.im)("div",{ref:n,className:"grid grid-cols-1 md:grid-cols-2 gap-5 w-full md:w-[725px] lg:w-[840px] my-0 mx-auto py-12 px-5 md:px-0 md:pt-16 md:pb-24"},a.map((e=>{let{node:{id:t,fields:{slug:r},frontmatter:n}}=e;return(0,o.im)(u,(0,c.c)({},n,{link:r,key:t}))})))},f=r(8532),d=r(3660);var g=function(e){let{location:{search:t},data:{site:{siteMetadata:{title:r,description:a,siteUrl:i}},allMarkdownRemark:{edges:c},file:{childImageSharp:{gatsbyImageData:l},publicURL:u}}}=e;const m=d.parse(t),g="string"==typeof m.category&&m.category?m.category:"All";(0,n.useMemo)((()=>c.reduce(((e,t)=>{let{node:{frontmatter:{categories:r}}}=t;return r.forEach((t=>{void 0===e[t]?e[t]=1:e[t]++})),e.All++,e}),{All:0})),[]);return(0,o.im)(f.c,{title:r,description:a,url:i,image:u},(0,o.im)(s,{profileImage:l}),(0,o.im)(p,{selectedCategory:g,posts:c}))}},3660:function(e,t,r){const n=r(4312),a=r(7140),o=r(444),i=r(9600),s=Symbol("encodeFragmentIdentifier");function c(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function l(e,t){return t.encode?t.strict?n(e):encodeURIComponent(e):e}function u(e,t){return t.decode?a(e):e}function m(e){return Array.isArray(e)?e.sort():"object"==typeof e?m(Object.keys(e)).sort(((e,t)=>Number(e)-Number(t))).map((t=>e[t])):e}function p(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function f(e){const t=(e=p(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function d(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function g(e,t){c((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return(e,r,n)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"colon-list-separator":return(e,r,n)=>{t=/(:list)$/.exec(e),e=e.replace(/:list$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return(t,r,n)=>{const a="string"==typeof r&&r.includes(e.arrayFormatSeparator),o="string"==typeof r&&!a&&u(r,e).includes(e.arrayFormatSeparator);r=o?u(r,e):r;const i=a||o?r.split(e.arrayFormatSeparator).map((t=>u(t,e))):null===r?r:u(r,e);n[t]=i};case"bracket-separator":return(t,r,n)=>{const a=/(\[\])$/.test(t);if(t=t.replace(/\[\]$/,""),!a)return void(n[t]=r?u(r,e):r);const o=null===r?[]:r.split(e.arrayFormatSeparator).map((t=>u(t,e)));void 0!==n[t]?n[t]=[].concat(n[t],o):n[t]=o};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const a of e.split("&")){if(""===a)continue;let[e,i]=o(t.decode?a.replace(/\+/g," "):a,"=");i=void 0===i?null:["comma","separator","bracket-separator"].includes(t.arrayFormat)?i:u(i,t),r(u(e,t),i,n)}for(const a of Object.keys(n)){const e=n[a];if("object"==typeof e&&null!==e)for(const r of Object.keys(e))e[r]=d(e[r],t);else n[a]=d(e,t)}return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce(((e,t)=>{const r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=m(r):e[t]=r,e}),Object.create(null))}t.extract=f,t.parse=g,t.stringify=(e,t)=>{if(!e)return"";c((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const r=r=>t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r],n=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{const a=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[l(t,e),"[",a,"]"].join("")]:[...r,[l(t,e),"[",l(a,e),"]=",l(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[l(t,e),"[]"].join("")]:[...r,[l(t,e),"[]=",l(n,e)].join("")];case"colon-list-separator":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[l(t,e),":list="].join("")]:[...r,[l(t,e),":list=",l(n,e)].join("")];case"comma":case"separator":case"bracket-separator":{const t="bracket-separator"===e.arrayFormat?"[]=":"=";return r=>(n,a)=>void 0===a||e.skipNull&&null===a||e.skipEmptyString&&""===a?n:(a=null===a?"":a,0===n.length?[[l(r,e),t,l(a,e)].join("")]:[[n,l(a,e)].join(e.arrayFormatSeparator)])}default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,l(t,e)]:[...r,[l(t,e),"=",l(n,e)].join("")]}}(t),a={};for(const i of Object.keys(e))r(i)||(a[i]=e[i]);const o=Object.keys(a);return!1!==t.sort&&o.sort(t.sort),o.map((r=>{const a=e[r];return void 0===a?"":null===a?l(r,t):Array.isArray(a)?0===a.length&&"bracket-separator"===t.arrayFormat?l(r,t)+"[]":a.reduce(n(r),[]).join("&"):l(r,t)+"="+l(a,t)})).filter((e=>e.length>0)).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[r,n]=o(e,"#");return Object.assign({url:r.split("?")[0]||"",query:g(f(e),t)},t&&t.parseFragmentIdentifier&&n?{fragmentIdentifier:u(n,t)}:{})},t.stringifyUrl=(e,r)=>{r=Object.assign({encode:!0,strict:!0,[s]:!0},r);const n=p(e.url).split("?")[0]||"",a=t.extract(e.url),o=t.parse(a,{sort:!1}),i=Object.assign(o,e.query);let c=t.stringify(i,r);c&&(c=`?${c}`);let u=function(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url);return e.fragmentIdentifier&&(u=`#${r[s]?l(e.fragmentIdentifier,r):e.fragmentIdentifier}`),`${n}${c}${u}`},t.pick=(e,r,n)=>{n=Object.assign({parseFragmentIdentifier:!0,[s]:!1},n);const{url:a,query:o,fragmentIdentifier:c}=t.parseUrl(e,n);return t.stringifyUrl({url:a,query:i(o,r),fragmentIdentifier:c},n)},t.exclude=(e,r,n)=>{const a=Array.isArray(r)?e=>!r.includes(e):(e,t)=>!r(e,t);return t.pick(e,a,n)}},444:function(e){e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}},4312:function(e){e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`))}}]);
//# sourceMappingURL=component---src-pages-index-tsx-ea3e77c75d104b18fa89.js.map