(this["webpackJsonppcr-booking-ui"]=this["webpackJsonppcr-booking-ui"]||[]).push([[0],{23:function(e,t,r){},24:function(e,t,r){},44:function(e,t,r){},45:function(e,t,r){"use strict";r.r(t);var a=r(0),n=r(1),s=r.n(n),c=r(15),i=r.n(c),l=(r(23),r(24),r(3)),o=r.n(l),b=r(5),d=r(4),j=r(16),h=r(17),u=r.n(h).a.create({baseURL:"https://www.travelpcrtest.com/",headers:{Authorization:"Basic QXp1cmXEaWFtb45kOmh1bnRlcjO="}}),O=function e(){Object(j.a)(this,e)};function x(){var e=Object(n.useState)(!1),t=Object(d.a)(e,2),r=t[0],c=t[1],i=Object(n.useState)(null),l=Object(d.a)(i,2),j=l[0],h=l[1];return Object(n.useEffect)((function(){(function(){var e=Object(b.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,c(!0),e.next=4,O.getReportLast7();case 4:"OK"===(t=e.sent).data.status&&h(t.data.result),c(!1),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),c(!1),console.log(e.t0);case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(a.jsxs)(s.a.Fragment,{children:[r&&Object(a.jsx)("h4",{style:{textAlign:"center"},children:"..."}),j&&Object(a.jsxs)("div",{style:{fontSize:"19px",fontWeight:"700",fontFamily:"Lato,sans-serif",color:"#5d5d5d",textAlign:"center",lineHeight:"1.42857143"},children:[Object(a.jsxs)("p",{style:{margin:"0 0 10px"},children:[g(j.lessThan12Percent),"% REPORTED UNDER 12 HOURS"]}),Object(a.jsxs)("p",{style:{margin:"0 0 10px"},children:[g(j.lessThan24Percent),"% REPORTED UNDER 24 HOURS"]}),Object(a.jsxs)("p",{style:{margin:"0 0 10px"},children:[g(j.lessThan36Percent),"% REPORTED UNDER 36 HOURS"]}),Object(a.jsxs)("p",{style:{margin:"0 0 10px"},children:[g(j.lessThan48Percent),"% REPORTED UNDER 48 HOURS"]})]})]})}function g(e){return Math.round(e)}O.getReportLast7=function(){return u.get("/api/book/getteststimereportlast7")};r(44);function p(){var e=Object(n.useState)(!1),t=Object(d.a)(e,2),r=t[0],c=t[1],i=Object(n.useState)(null),l=Object(d.a)(i,2),j=l[0],h=l[1];return Object(n.useEffect)((function(){(function(){var e=Object(b.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,c(!0),e.next=4,O.getReportLast7();case 4:"OK"===(t=e.sent).data.status&&h(t.data.result),c(!1),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(0),c(!1),console.log(e.t0);case 13:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(a.jsx)(s.a.Fragment,{children:Object(a.jsxs)("div",{style:{textAlign:"center",padding:"20px",maxWidth:"430px",maxHeight:"410px",overflow:"hidden",fontFamily:"Lato,sans-serif"},children:[r&&Object(a.jsx)("h4",{children:"..."}),j&&Object(a.jsxs)("div",{children:[Object(a.jsx)("p",{style:{margin:"0 0 10px",fontWeight:"600",fontSize:"1rem"},children:"LAST 7 DAYS PCR TEST TURN AROUND TIME"}),Object(a.jsx)("p",{style:{margin:"0 0 10px",fontWeight:"500",fontSize:"0.88rem",color:"#333"},children:"LAST 7 DAYS PCR TEST RESULTS SENT WITHIN :"}),Object(a.jsxs)("div",{className:"bar",style:{borderColor:"#009f40",color:"#009f40"},children:[Object(a.jsx)("div",{className:"barBG",style:{width:"".concat(j.lessThan12Percent/1.3,"%"),background:"linear-gradient(274deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 5%, rgba(0,255,76,1) 100%)"}}),Object(a.jsx)("div",{className:"barText",children:"12 Hours"}),Object(a.jsxs)("div",{className:"barPercent",children:[j.lessThan12Percent,"%"]})]}),Object(a.jsxs)("div",{className:"bar",style:{color:"#00a1d9",borderColor:"#00a1d9"},children:[Object(a.jsx)("div",{className:"barBG",style:{width:"".concat(j.lessThan24Percent/1.3,"%"),background:"linear-gradient(274deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 5%, rgba(0,189,255,1) 100%)"}}),Object(a.jsx)("div",{className:"barText",children:"24 Hours"}),Object(a.jsxs)("div",{className:"barPercent",children:[j.lessThan24Percent,"%"]})]}),Object(a.jsxs)("div",{className:"bar",style:{color:"rgba(154,0,255,1)",borderColor:"rgba(154,0,255,1)"},children:[Object(a.jsx)("div",{className:"barBG",style:{width:"".concat(j.lessThan36Percent/1.3,"%"),background:"linear-gradient(274deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 5%, rgba(154,0,255,1) 100%)"}}),Object(a.jsx)("div",{className:"barText",children:"36 Hours"}),Object(a.jsxs)("div",{className:"barPercent",children:[j.lessThan36Percent,"%"]})]}),Object(a.jsxs)("div",{className:"bar",style:{color:"rgba(255,0,65,1)",borderColor:"rgba(255,0,65,1)"},children:[Object(a.jsx)("div",{className:"barBG",style:{width:"".concat(j.lessThan48Percent/1.3,"%"),background:"linear-gradient(274deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 5%, rgba(255,0,65,1) 100%)"}}),Object(a.jsx)("div",{className:"barText",children:"48 Hours"}),Object(a.jsxs)("div",{className:"barPercent",children:[j.lessThan48Percent,"%"]})]})]})]})})}var f=function(){var e=window.location.pathname.split("/");return e[e.length-1]};var m=function(){return Object(n.useEffect)((function(){}),[]),Object(a.jsxs)("div",{className:"App",children:["text"===f()&&Object(a.jsx)(x,{}),"chart"===f()&&Object(a.jsx)(p,{})]})};i.a.render(Object(a.jsx)(s.a.StrictMode,{children:Object(a.jsx)(m,{})}),document.getElementById("root"))}},[[45,1,2]]]);
//# sourceMappingURL=main.d9cd6dda.chunk.js.map