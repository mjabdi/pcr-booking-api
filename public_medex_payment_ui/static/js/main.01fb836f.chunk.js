(this["webpackJsonppcr-booking-ui"]=this["webpackJsonppcr-booking-ui"]||[]).push([[0],{109:function(t,e){var n=function(t){var e=199;return t.certificate&&(e+=50),t.antiBodyTest&&(e+=149),e};t.exports={calculatePrice:n,calculateTotalPrice:function(t){for(var e=0,a=0;a<t.length;a++)e+=n(t[a]);return e}}},110:function(t,e){t.exports={FormatDateFromString:function(t){return"".concat(t.substr(8,2),"/").concat(t.substr(5,2),"/").concat(t.substr(0,4))}}},137:function(t,e,n){},174:function(t,e,n){},176:function(t,e,n){},205:function(t,e,n){},217:function(t,e,n){"use strict";n.r(e);var a=n(1),o=n(0),i=n.n(o),r=n(18),p=n.n(r),c=(n(174),n(13)),d=n.n(c),g=n(5),s=n(24),l=n(7),m=(n(176),n(10)),f=n(256),x=n(279),u=n(146),b=(n(298),n(280),n(290),n(265),n(278),n(103)),h=n(15),j=n(25),y=n(40),O=(n(27),n(285),n(99)),k=i.a.createContext([{},function(){}]),v=(n(23),n(139)),w=n.n(v).a.create({baseURL:"https://www.travelpcrtest.com/",headers:{Authorization:"Basic QXp1cmXEaWFtb45kOmh1bnRlcjO="}}),T=n(77),B=n.n(T),R=n(20),C=n.n(R),I=function t(){Object(h.a)(this,t)};I.getFirstAvailableDate=function(){return B()(w,{retries:3,retryDelay:function(t){return 1e3*t}}),w.get("/api/dentist/time/getfirstavaiabledate")},I.getFullyBookedDates=function(){return B()(w,{retries:3,retryDelay:function(t){return 1e3*t}}),w.get("/api/dentist/time/getfullybookeddays")},I.getTimeSlots=function(t){B()(w,{retries:3,retryDelay:function(t){return 1e3*t}});var e=C()(new Date(t.toUTCString().slice(0,-4)),"yyyy-mm-dd");return w.get("/api/dentist/time/gettimeslots?date=".concat(e))};var S=n(261),L=(n(271),n(259),n(300));O.a,Object(f.a)((function(t){return{loadingBox:{},pageTitle:{color:t.palette.primary.main,marginBottom:"15px"}}}));n(272),n(273),n(108),Object(f.a)((function(t){return{root:{display:"flex",flexWrap:"wrap",justifyContent:"space-around",overflow:"hidden",backgroundColor:t.palette.background.paper},gridList:{},box:{border:"1px solid #999",margin:"5px",padding:"5px",color:"#555",cursor:"pointer","&:hover":{background:t.palette.primary.light}},boxMobile:{border:"1px solid #999",margin:"5px",padding:"5px",color:"#555",cursor:"pointer"},boxSelected:{backgroundColor:t.palette.primary.main,border:"1px solid ".concat(t.palette.primary.light),margin:"5px",padding:"5px",color:"#fff",cursor:"pointer"},boxDisable:{backgroundColor:"#999",border:"1px solid #ddd",margin:"5px",padding:"5px",color:"#fff"},pageTitle:{color:t.palette.primary.main,marginBottom:"15px"}}}));n(293),n(66),n(291),n(275),n(274),n(111),n(109),n(110),Object(f.a)((function(t){return{box:{backgroundColor:"#373737",color:"#fff",padding:"1px",borderRadius:"4px",textAlign:"justify",paddingRight:"40px"},boxRed:{backgroundColor:"#dc2626",color:"#fff",padding:"1px",borderRadius:"4px",textAlign:"justify",paddingRight:"40px"},boxInfo:{textAlign:"justify",backgroundColor:"#fafafa",color:"#333",padding:"1px",borderRadius:"4px",paddingRight:"40px",border:"1px solid #eee"},ul:{listStyle:"none",padding:"0",margin:"0"},li:{marginBottom:"5px"},icon:{marginRight:"8px"},root:{width:"100%"},heading:{fontSize:t.typography.pxToRem(15),flexBasis:"33.33%",flexShrink:0,color:t.palette.text.secondary},secondaryHeading:{fontSize:t.typography.pxToRem(15)},infoDetails:{textAlign:"left"},infoTitle:{fontWeight:"800",marginRight:"10px"},infoData:{fontWeight:"400"},title:{textAlign:"left",fontWeight:"600",marginLeft:"10px"},Accordion:{backgroundColor:"#f5f5f5",color:"#222"}}}));n(276),n(289),Object(f.a)((function(t){return{formControl:{},Box:{backgroundColor:"#f1f1f1",padding:"10px",borderRadius:"10px",boxShadow:"2px 4px #ddd",marginTop:"5px",marginBottom:"15px",textAlign:"left"},Label:{},CheckBox:{}}}));n(270),n(295),n(286),n(296),Object(f.a)((function(t){return{loadingBox:{}}})),O.a,Object(f.a)((function(t){return{formControl:{textAlign:"left"},FormTitle:{marginTop:"20px",marginBottom:"20px"},Box:{backgroundColor:"#f1f1f1",padding:"10px",borderRadius:"10px",boxShadow:"2px 4px #ddd",marginTop:"5px",marginBottom:"15px",textAlign:"left"},pageTitle:{color:t.palette.primary.main,marginBottom:"15px"}}}));n(67),n(42);var W=n(55),A=n.n(W),P=function t(){Object(h.a)(this,t)};P.bookAppointment=function(t){return w.post("/api/dentist/book/bookappointment",t)},P.getNewReference=function(){return w.get("/api/book/getnewreference")},P.getBookingById=function(t){return w.get("/api/dentist/book/getbookingbyid?id=".concat(t))};Object(f.a)((function(t){return{box:{backgroundColor:"#fff",border:"1px solid #ddd",borderRadius:"5px",color:"#555",padding:"30px 0px 15px 20px",textAlign:"justify",marginTop:"20px",position:"relative"},boxTime:{backgroundColor:"#fff",border:"1px solid #ddd",borderRadius:"5px",color:"#333",padding:"30px 0px 0px 20px",textAlign:"justify",marginTop:"20px",position:"relative"},boxTitle:{position:"absolute",backgroundColor:"#fff",padding:"10px",top:-20,left:10,color:t.palette.primary.main,fontWeight:"500"},boxRed:{backgroundColor:"#dc2626",color:"#fff",padding:"1px",borderRadius:"4px",textAlign:"justify",paddingRight:"40px"},boxInfo:{textAlign:"justify",backgroundColor:"#fafafa",color:"#333",borderRadius:"4px",border:"1px solid #eee"},ul:{listStyle:"none",padding:"0",margin:"0"},li:{marginBottom:"15px",fontSize:"0.95rem"},icon:{marginRight:"10px",fontSize:"1.2rem",color:t.palette.secondary.main,float:"left"},root:{width:"100%"},heading:{fontSize:t.typography.pxToRem(15),flexBasis:"33.33%",flexShrink:0,color:t.palette.text.secondary},secondaryHeading:{fontSize:t.typography.pxToRem(15)},infoDetails:{textAlign:"left"},infoTitle:{fontWeight:"800",float:"left",width:"120px"},infoData:{fontWeight:"400"},infoTitleTime:{fontWeight:"800",float:"left",marginRight:"10px"},infoDataTime:{fontWeight:"600"},title:{textAlign:"left",fontWeight:"500",marginTop:"5px",padding:"10px",borderRadius:"4px"},Accordion:{backgroundColor:"#f5f5f5",color:"#111"},terms:{fontWeight:"500",textAlign:"justify",marginTop:"10px",padding:"10px"},link:{color:t.palette.primary.main,textDecoration:"none"},AddAnother:{marginTop:"10px",marginBottom:"10px"},pageTitle:{color:t.palette.primary.main,marginBottom:"15px"},infoDataPrice:{color:t.palette.secondary.main,fontWeight:"600"}}}));n(262),n(264),n(263),n(282),n(281);var D=n(8),N=n(297),z=(Object(D.a)({root:{maxWidth:"100%",flexGrow:1},progress:{width:"100%"}})(N.a),n(218)),_=n(266),M=n.p+"static/media/ok2.c105a1fa.png";n.p,n(287),Object(f.a)((function(t){return{bold:{fontWeight:"800",padding:"5px",color:t.palette.secondary.main},doneImage:{width:"330px",height:"207px",margin:"20px"},errorImage:{width:"200px",height:"190px",margin:"20px"},thankText:{color:t.palette.primary.main,fontWeight:"500"},error:{color:t.palette.secondary.main}}}));Object(f.a)((function(t){return{formControl:{textAlign:"justify"},FormTitle:{marginTop:"20px",marginBottom:"20px"},packageBox:{backgroundColor:"#fff",border:"1px solid #999",color:"#555",fontWeight:"500",fontSize:"1.1rem",borderRadius:"4px",width:"100%",padding:"20px",cursor:"pointer",transition:"all 0.1s ease-in-out","&:hover":{backgroundColor:t.palette.primary.light}},packageBoxSelected:{backgroundColor:t.palette.primary.main,border:"1px solid ".concat(t.palette.primary.light),fontWeight:"500",fontSize:"1.1rem",borderRadius:"4px",width:"100%",padding:"20px",color:"#fff",cursor:"pointer"},pageTitle:{color:t.palette.primary.main,marginBottom:"15px"}}}));var E=n(22),F=n(28),H=(n(137),function t(){Object(h.a)(this,t)});H.doPayment=function(t){return w.post("/api/medex/payment/dopayment",t)},H.refundPayment=function(t){return w.post("/api/medex/payment/refundpayment",{medexPaymentId:t})},H.createNewPaymentLink=function(t){return w.post("/api/medex/payment/createpayment",{paymentRecord:t})},H.deletePaymentLink=function(t){return w.post("/api/medex/payment/deletepayment",{medexPaymentId:t})},H.getAllPayments=function(){return w.get("/api/medex/payment/getallpayments")},H.getDeletedPayments=function(){return w.get("/api/medex/payment/getdeletedpayments")},H.getPaidPayments=function(){return w.get("/api/medex/payment/getpaidpayments")},H.getRefundPayments=function(){return w.get("/api/medex/payment/getrefundpayments")},H.getPaymentById=function(t){return w.get("/api/medex/payment/getpaymentbyid?id=".concat(t))};var V=n(277),J=n(288),X=function(t){Object(j.a)(n,t);var e=Object(y.a)(n);function n(t){var a;return Object(h.a)(this,n),(a=e.call(this,t)).cardNonceResponseReceived=function(){var t=Object(s.a)(d.a.mark((function t(e,n){var o;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log({token:e,buyer:n}),a.setState({errorMessages:[]}),t.prev=2,a.props.onStart(),t.next=6,H.doPayment({nonce:e.token,token:n.token,medexPaymentId:a.state.personInfo._id});case 6:o=t.sent,console.log(o),a.props.onComplete(o),t.next=15;break;case 11:t.prev=11,t.t0=t.catch(2),console.error(t.t0),a.props.onError(t.t0);case 15:case"end":return t.stop()}}),t,null,[[2,11]])})));return function(e,n){return t.apply(this,arguments)}}(),a.state={personInfo:t.personInfo,errorMessages:[]},a.cardNonceResponseReceived=a.cardNonceResponseReceived.bind(Object(F.a)(a)),a.createVerificationDetails=a.createVerificationDetails.bind(Object(F.a)(a)),a}return Object(E.a)(n,[{key:"createVerificationDetails",value:function(){return{amount:"".concat(this.state.personInfo.amount),currencyCode:"GBP",intent:"CHARGE",billingContact:{name:this.state.personInfo.fullname,email:this.state.personInfo.email,phone:this.state.personInfo.phone}}}},{key:"render",value:function(){return Object(a.jsx)(V.a,{applicationId:"sq0idp-8-tRTRJuDMDeTBHxJq02xg",locationId:"L2SBNYPV0XWVJ",overrides:{scriptSrc:"https://js.squareup.com/v2/paymentform"},cardTokenizeResponseReceived:this.cardNonceResponseReceived,createVerificationDetails:this.createVerificationDetails,children:Object(a.jsx)("div",{style:{padding:"20px 10px"},children:Object(a.jsx)(J.a,{buttonProps:{css:{backgroundColor:"#b30c1d",color:"#fff","&:hover":{backgroundColor:"#de071d"}}},children:Object(a.jsxs)("span",{style:{fontWeight:"600",fontSize:"1.2em"},children:["Pay ","\xa3".concat(this.state.personInfo.amount)]})})})})}}]),n}(i.a.Component),q=n(141),G=(n(56),n(205),Object(q.a)("pk_live_51InSXCJ3U7h4NHwdQSvc3ITNikQJRw0otzlcVnUXDKrS51Xu2drNoOIfOk3VRZyJEsVarVkGJOrLz2HywPdM8Qdl006sUXBTwX"),Object(f.a)((function(t){return{formControl:{textAlign:"justify"},FormTitle:{marginTop:"20px",marginBottom:"20px"},pageTitle:{color:"#fff",backgroundColor:t.palette.primary.main,marginBottom:"15px",minWidth:"320px",padding:"15px"},backdrop:{zIndex:t.zIndex.drawer+111,color:"#fff"},boxTitle:{position:"absolute",backgroundColor:"#fff",padding:"10px",top:-20,left:10,color:t.palette.primary.main,fontWeight:"500"},boxTime:{backgroundColor:"#fff",border:"1px solid #ddd",borderRadius:"5px",color:"#333",padding:"30px 20px",textAlign:"left",position:"relative"},boxInfo:{backgroundColor:"#fff",border:"1px solid #ddd",borderRadius:"5px",color:"#333",padding:"10px 5px",textAlign:"left",position:"relative"},layout:Object(m.a)({width:"auto",marginLeft:t.spacing(2),marginRight:t.spacing(2)},t.breakpoints.up(600+2*t.spacing(2)),{width:700,marginLeft:"auto",marginRight:"auto"}),paper:Object(m.a)({position:"relative",marginTop:t.spacing(1),marginBottom:t.spacing(3),padding:t.spacing(0)},t.breakpoints.up(600+2*t.spacing(3)),{marginTop:t.spacing(1),marginBottom:t.spacing(2),padding:t.spacing(0)}),itemLabel:{fontSize:"1rem",fontWeight:"500",color:"#777",marginRight:"10px"},itemData:{fontSize:"1rem",fontWeight:"600",color:"#333"}}})));function U(){var t=G(),e=i.a.useContext(k),n=Object(l.a)(e,2),r=n[0],p=n[1],c=i.a.useState(!1),d=Object(l.a)(c,2),s=d[0],m=d[1],f=i.a.useState(!1),x=Object(l.a)(f,2),b=x[0],h=x[1],j=i.a.useState(null),y=Object(l.a)(j,2),O=y[0],v=y[1];Object(o.useEffect)((function(){window.scrollTo(0,0);var t=document.createElement("script");t.src="https://js.squareup.com/v2/paymentform",t.type="text/javascript",t.async=!1,t.onload=function(){h(!0)},document.getElementsByTagName("head")[0].appendChild(t),w()}),[]);var w=function(){var t={_id:r.payment._id,fullname:r.payment.fullname,email:r.payment.email,phone:r.payment.phone,amount:r.payment.amount};v(t)};return Object(a.jsx)(i.a.Fragment,{children:Object(a.jsx)("main",{className:t.layout,children:Object(a.jsxs)(u.a,{className:t.paper,children:[Object(a.jsxs)("div",{className:t.pageTitle,children:[Object(a.jsx)("div",{style:{fontSize:"0.9rem",color:"#fafafa"},children:"Total to Pay :"}),Object(a.jsx)("div",{style:{fontSize:"1.5rem",fontWeight:"600"},children:"\xa3".concat(r.payment.amount.toLocaleString("en-GB"))})]}),Object(a.jsxs)("div",{style:{padding:"10px 20px"},children:[Object(a.jsxs)("div",{className:t.boxInfo,children:[Object(a.jsx)("div",{className:t.boxTitle,children:"Payment Info"}),Object(a.jsxs)(S.a,{container:!0,spacing:2,style:{padding:"15px 5px 10px 15px"},children:[Object(a.jsxs)(S.a,{item:!0,xs:12,style:{textAlign:"left"},children:[Object(a.jsx)("span",{className:t.itemLabel,children:"Issued by :"}),Object(a.jsx)("span",{className:t.itemData,children:"Medical Express Clinic"})]}),Object(a.jsxs)(S.a,{item:!0,xs:12,style:{textAlign:"left"},children:[Object(a.jsx)("span",{className:t.itemLabel,children:"Issued for :"}),Object(a.jsx)("span",{className:t.itemData,children:r.payment.fullname})]}),r.payment.description&&r.payment.description.length>0&&Object(a.jsxs)(S.a,{item:!0,xs:12,style:{textAlign:"left"},children:[Object(a.jsx)("span",{className:t.itemLabel,children:"Description :"}),Object(a.jsx)("span",{className:t.itemData,children:r.payment.description})]})]})]}),Object(a.jsxs)("div",{className:t.boxTime,style:{marginTop:"30px"},children:[Object(a.jsx)("div",{className:t.boxTitle,children:"Enter Your Card Info"}),b&&O&&Object(a.jsx)(X,{personInfo:O,onStart:function(){m(!0)},onComplete:function(t){p((function(e){return Object(g.a)(Object(g.a)({},e),{},{payment_method:t.data.payment.id,payment_already_done:!1})})),m(!1)},onError:function(t){console.log(t),m(!1)}})]}),Object(a.jsxs)("div",{style:{marginTop:"20px"},children:[Object(a.jsx)("div",{style:{color:"#f68529",fontWeight:"500",marginBottom:"5px"},children:"Powered and Secured by :"}),Object(a.jsx)("a",{href:"https://www.medicalexpressclinic.co.uk/",target:"_blank",children:Object(a.jsx)("img",{src:"https://www.medicalexpressclinic.co.uk/public/design/images/medical-express-clinic-logo.png",alt:"logo",style:{width:"85px",height:"60px"}})})]})]}),Object(a.jsx)(z.a,{className:t.backdrop,open:s,children:Object(a.jsxs)(S.a,{container:!0,direction:"column",justify:"center",alignItems:"center",spacing:2,children:[Object(a.jsx)(S.a,{item:!0,children:Object(a.jsx)(_.a,{color:"inherit"})}),Object(a.jsx)(S.a,{item:!0,children:Object(a.jsxs)("span",{style:{textAlign:"center",color:"#fff"},children:[" ","Please wait ..."," "]})})]})})]})})})}Object(f.a)((function(t){return{appBar:{position:"relative",backgroundColor:"#fff",color:"#00a1c5",alignItems:"center"},logo:{maxWidth:160},layout:Object(m.a)({width:"auto",marginLeft:t.spacing(2),marginRight:t.spacing(2)},t.breakpoints.up(600+2*t.spacing(2)),{width:700,marginLeft:"auto",marginRight:"auto"}),paper:Object(m.a)({marginTop:t.spacing(0),marginBottom:t.spacing(3),padding:t.spacing(1)},t.breakpoints.up(600+2*t.spacing(3)),{marginTop:t.spacing(0),marginBottom:t.spacing(2),padding:t.spacing(3)}),stepper:{padding:t.spacing(3,0,5)},buttons:{display:"flex",justifyContent:"flex-end"},button:{marginTop:t.spacing(3),marginLeft:t.spacing(1)},bold:{fontWeight:"800",padding:"5px"},doneImage:{width:"240px",height:"150px",margin:"20px"},logoImage:{width:"40px",height:"40px",marginLeft:"0px"},privacyButton:{marginBottom:"20px",width:"115px",color:"#fff",backgroundColor:"#444","&:hover":{background:"#000",color:"#fff"}},faqButton:{marginBottom:"20px",marginLeft:"10px",backgroundColor:"#444","&:hover":{background:"#000",color:"#fff"},width:"115px",color:"#fff"},backdrop:{zIndex:t.zIndex.drawer+1,color:"#fff"},mainTitle:{color:t.palette.primary.main,fontSize:"1.5rem"}}}));n(283),n(267),n(74),n(75);Object(f.a)((function(t){return{appBar:{position:"relative",backgroundColor:"#fff",color:"#00a1c5",alignItems:"center"},logo:{maxWidth:160},layout:Object(m.a)({width:"auto",marginLeft:t.spacing(2),marginRight:t.spacing(2)},t.breakpoints.up(600+2*t.spacing(2)),{width:700,marginLeft:"auto",marginRight:"auto"}),paper:Object(m.a)({marginTop:t.spacing(1),marginBottom:t.spacing(3),padding:t.spacing(1)},t.breakpoints.up(600+2*t.spacing(3)),{marginTop:t.spacing(2),marginBottom:t.spacing(2),padding:t.spacing(3)}),stepper:{padding:t.spacing(3,0,5)},buttons:{display:"flex",justifyContent:"flex-end"},button:{marginTop:t.spacing(3),marginLeft:t.spacing(1)},bold:{fontWeight:"800",padding:"5px"},doneImage:{width:"240px",height:"150px",margin:"20px"},logoImage:{width:"40px",height:"40px",marginLeft:"0px"},privacyButton:{marginBottom:"20px",width:"115px",color:"#fff",backgroundColor:"#444","&:hover":{background:"#000",color:"#fff"}},faqButton:{marginBottom:"20px",marginLeft:"10px",backgroundColor:"#444","&:hover":{background:"#000",color:"#fff"},width:"115px",color:"#fff"},textContent:{color:"#666f77",fontSize:"1.1rem",textAlign:"justify",paddingLeft:"30px",paddingRight:"30px",lineHeight:"2.2em",fontWeight:"400"},textContentMobile:{color:"#666f77",fontSize:"0.9rem",textAlign:"justify",paddingLeft:"30px",paddingRight:"30px",lineHeight:"1.5rem",fontWeight:"400"},getStartedButton:{marginTop:"10px",marginBottom:"10px"},AirIcon:{marginRight:"10px",fontSize:"32px"},gynaeLogo:{}}}));Object(f.a)((function(t){return{appBar:{position:"relative",backgroundColor:"#fff",color:"#00a1c5",alignItems:"center"},logo:{maxWidth:160},layout:Object(m.a)({width:"auto",marginLeft:t.spacing(2),marginRight:t.spacing(2)},t.breakpoints.up(600+2*t.spacing(2)),{width:700,marginLeft:"auto",marginRight:"auto"}),paper:Object(m.a)({marginTop:t.spacing(1),marginBottom:t.spacing(3),padding:t.spacing(1)},t.breakpoints.up(600+2*t.spacing(3)),{marginTop:t.spacing(2),marginBottom:t.spacing(2),padding:t.spacing(3)}),stepper:{padding:t.spacing(3,0,5)},buttons:{display:"flex",justifyContent:"flex-end"},button:{marginTop:t.spacing(3),marginLeft:t.spacing(1)},bold:{fontWeight:"800",padding:"5px"},doneImage:{width:"240px",height:"150px",margin:"20px"},logoImage:{width:"40px",height:"40px",marginLeft:"0px"},privacyButton:{marginBottom:"20px",width:"115px",color:"#fff",backgroundColor:"#444","&:hover":{background:"#000",color:"#fff"}},faqButton:{marginBottom:"20px",marginLeft:"10px",backgroundColor:"#444","&:hover":{background:"#000",color:"#fff"},width:"115px",color:"#fff"},getStartedButton:{marginTop:"30px",marginBottom:"10px"},textContent:{color:"#666f77",fontSize:"1.1rem",textAlign:"justify",paddingLeft:"8px",paddingRight:"20px",lineHeight:"2.2em",fontWeight:"400"},textContentMobile:{color:"#666f77",fontSize:"0.9rem",textAlign:"justify",paddingLeft:"8px",paddingRight:"20px",lineHeight:"2.2em",fontWeight:"400"}}}));var Q=n(143),Y=n(299),K=n(142),Z="rgb(36, 40, 44)",$="rgba(0, 0, 0, 0.13)",tt=Object(Q.a)({palette:{primary:{main:"#00a1c5",light:"#05acb2",contrastText:"#fff"},secondary:{main:"#bf9b30",contrastText:"#fff"},common:{black:"#212121",darkBlack:Z},warning:{light:"rgba(253, 200, 69, .3)",main:"rgba(253, 200, 69, .5)",dark:"rgba(253, 200, 69, .7)"},tonalOffset:.2,background:{default:"#f9f9f9"},spacing:8},breakpoints:{values:{xl:1920,lg:1280,md:960,sm:600,xs:0}},border:{borderColor:$,borderWidth:2},overrides:{MuiExpansionPanel:{root:{position:"static"}},MuiTableCell:{root:Object(m.a)({paddingLeft:16,paddingRight:16,borderBottom:"".concat(2,"px solid ").concat($)},"@media (max-width:  ".concat(600,"px)"),{paddingLeft:8,paddingRight:8})},MuiDivider:{root:{backgroundColor:$,height:2}},MuiPrivateNotchedOutline:{root:{borderWidth:2}},MuiListItem:{divider:{borderBottom:"".concat(2,"px solid ").concat($)}},MuiDialog:{paper:{width:"100%",maxWidth:430,marginLeft:8,marginRight:8}},MuiTooltip:{tooltip:{backgroundColor:Z,fontSize:"0.7rem"}},MuiExpansionPanelDetails:{root:Object(m.a)({},"@media (max-width:  ".concat(600,"px)"),{paddingLeft:8,paddingRight:8})}}},K.enGB),et=Object(Y.a)(tt),nt=n(284);var at=Object(D.a)((function(t){var e,n,a,o,i;return{"@global":{"*:focus":{outline:0},".text-white":{color:t.palette.common.white},".listItemLeftPadding":(e={paddingTop:"".concat(t.spacing(1.75),"px !important"),paddingBottom:"".concat(t.spacing(1.75),"px !important"),paddingLeft:"".concat(t.spacing(4),"px !important")},Object(m.a)(e,t.breakpoints.down("sm"),{paddingLeft:"".concat(t.spacing(4),"px !important")}),Object(m.a)(e,"@media (max-width:  420px)",{paddingLeft:"".concat(t.spacing(1),"px !important")}),e),".container":(n={width:"100%",paddingRight:t.spacing(4),paddingLeft:t.spacing(4),marginRight:"auto",marginLeft:"auto"},Object(m.a)(n,t.breakpoints.up("sm"),{maxWidth:540}),Object(m.a)(n,t.breakpoints.up("md"),{maxWidth:720}),Object(m.a)(n,t.breakpoints.up("lg"),{maxWidth:1170}),n),".row":{display:"flex",flexWrap:"wrap",marginRight:-t.spacing(2),marginLeft:-t.spacing(2)},".container-fluid":{width:"100%",paddingRight:t.spacing(2),paddingLeft:t.spacing(2),marginRight:"auto",marginLeft:"auto",maxWidth:1370},".lg-mg-top":(a={marginTop:"".concat(t.spacing(20),"px !important")},Object(m.a)(a,t.breakpoints.down("md"),{marginTop:"".concat(t.spacing(18),"px !important")}),Object(m.a)(a,t.breakpoints.down("sm"),{marginTop:"".concat(t.spacing(16),"px !important")}),Object(m.a)(a,t.breakpoints.down("xs"),{marginTop:"".concat(t.spacing(14),"px !important")}),a),".lg-mg-bottom":(o={marginBottom:"".concat(t.spacing(20),"px !important")},Object(m.a)(o,t.breakpoints.down("md"),{marginBottom:"".concat(t.spacing(18),"px !important")}),Object(m.a)(o,t.breakpoints.down("sm"),{marginBottom:"".concat(t.spacing(16),"px !important")}),Object(m.a)(o,t.breakpoints.down("xs"),{marginBottom:"".concat(t.spacing(14),"px !important")}),o),".lg-p-top":(i={paddingTop:"".concat(t.spacing(20),"px !important")},Object(m.a)(i,t.breakpoints.down("md"),{paddingTop:"".concat(t.spacing(18),"px !important")}),Object(m.a)(i,t.breakpoints.down("sm"),{paddingTop:"".concat(t.spacing(16),"px !important")}),Object(m.a)(i,t.breakpoints.down("xs"),{paddingTop:"".concat(t.spacing(14),"px !important")}),i)}}}),{withTheme:!0})((function(){return null})),ot=n(68),it=!1,rt=(i.a.Component,Object(f.a)((function(t){return{formControl:{textAlign:"justify"},FormTitle:{marginTop:"20px",marginBottom:"20px"},pageTitle:{color:"#fff",backgroundColor:t.palette.primary.main,marginBottom:"15px",minWidth:"320px",padding:"15px"},backdrop:{zIndex:t.zIndex.drawer+1,color:"#fff"},boxTitle:{position:"absolute",backgroundColor:"#fff",padding:"10px",top:-20,left:10,color:t.palette.primary.main,fontWeight:"500"},boxTime:{backgroundColor:"#fff",border:"1px solid #ddd",borderRadius:"5px",color:"#333",padding:"10px 5px",textAlign:"left",position:"relative"},layout:Object(m.a)({width:"auto",marginLeft:t.spacing(2),marginRight:t.spacing(2)},t.breakpoints.up(600+2*t.spacing(2)),{width:700,marginLeft:"auto",marginRight:"auto"}),paper:Object(m.a)({position:"relative",marginTop:t.spacing(1),marginBottom:t.spacing(3),padding:t.spacing(0)},t.breakpoints.up(600+2*t.spacing(3)),{marginTop:t.spacing(1),marginBottom:t.spacing(2),padding:t.spacing(0)}),itemLabel:{fontSize:"1rem",fontWeight:"500",color:"#777",marginRight:"10px"},itemData:{fontSize:"1rem",fontWeight:"600",color:"#333"},doneImage:{width:"330px",height:"207px",margin:"20px"},thankText:{color:"#009c39",fontWeight:"500",lineHeight:"2.5rem"},bold:{fontWeight:"800",padding:"5px",color:t.palette.primary.main}}})));function pt(){var t=rt(),e=i.a.useContext(k),n=Object(l.a)(e,2),o=n[0],r=(n[1],i.a.useState(!1)),p=Object(l.a)(r,2),c=p[0];p[1];return Object(a.jsx)(i.a.Fragment,{children:Object(a.jsx)("main",{className:t.layout,children:Object(a.jsxs)(u.a,{className:t.paper,children:[Object(a.jsx)("div",{style:{padding:"10px 20px 30px"},children:Object(a.jsxs)(A.a,{down:!0,children:[Object(a.jsx)("img",{className:t.doneImage,src:M,alt:"Done image"}),Object(a.jsx)(b.a,{variant:o.payment_already_done?"h5":"h4",gutterBottom:!0,className:t.thankText,children:o.payment_already_done?"Your Payment is Already Done Successfully.":"Thank you for your Payment."})]})}),Object(a.jsx)(z.a,{className:t.backdrop,open:c,children:Object(a.jsxs)(S.a,{container:!0,direction:"column",justify:"center",alignItems:"center",spacing:2,children:[Object(a.jsx)(S.a,{item:!0,children:Object(a.jsx)(_.a,{color:"inherit"})}),Object(a.jsx)(S.a,{item:!0,children:Object(a.jsxs)("span",{style:{textAlign:"center",color:"#fff"},children:[" ","Please wait ..."," "]})})]})})]})})})}var ct=function(){var t=window.location.pathname.split("/");return 4===t.length&&"pay"===t[2]?t[3]:null};var dt=function(){var t=i.a.useState({activeStep:0,bookingDate:null,persons:[]}),e=Object(l.a)(t,2),n=e[0],r=e[1];Object(o.useEffect)((function(){p()}),[]);var p=function(){var t=Object(s.a)(d.a.mark((function t(){var e,n,a,o,i;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e=ct(),t.next=4,H.getPaymentById(e);case 4:(n=t.sent)&&n.data&&"OK"===n.data.status&&n.data.result?(a=n.data.result,o=null,a.deleted||a.refund?a.deleted?r((function(t){return Object(g.a)(Object(g.a)({},t),{},{payment_invalid:!0})})):a.refund?r((function(t){return Object(g.a)(Object(g.a)({},t),{},{payment_refund:!0})})):r((function(t){return Object(g.a)(Object(g.a)({},t),{},{payment_invalid:!0})})):(a.paymentInfo&&(i=JSON.parse(a.paymentInfo),o=i.id),r((function(t){return Object(g.a)(Object(g.a)({},t),{},{payment:a,payment_method:o,payment_already_done:!0})})))):r((function(t){return Object(g.a)(Object(g.a)({},t),{},{payment_invalid:!0})})),t.next=11;break;case 8:t.prev=8,t.t0=t.catch(0),console.error(t.t0);case 11:case"end":return t.stop()}}),t,null,[[0,8]])})));return function(){return t.apply(this,arguments)}}();return Object(a.jsx)(k.Provider,{value:[n,r],children:Object(a.jsxs)(nt.a,{theme:et,children:[Object(a.jsx)(x.a,{}),Object(a.jsx)(at,{}),Object(a.jsxs)("div",{className:"App",children:[n.payment&&!n.payment_method&&Object(a.jsx)(U,{}),n.payment&&n.payment_method&&Object(a.jsx)(pt,{}),n.payment_invalid&&"Invalid Payment Link!",n.payment_refund&&"Payment Already Refunded!"]})]})})};p.a.render(Object(a.jsx)(i.a.StrictMode,{children:Object(a.jsx)(dt,{})}),document.getElementById("root"))}},[[217,1,2]]]);
//# sourceMappingURL=main.01fb836f.chunk.js.map