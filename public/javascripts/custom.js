$( document ).ready(function() {
  $("textarea").jqte();

  // function getDocHeight() {
  //     var D = document;
  //     return Math.max(
  //         D.body.scrollHeight, D.documentElement.scrollHeight,
  //         D.body.offsetHeight, D.documentElement.offsetHeight,
  //         D.body.clientHeight, D.documentElement.clientHeight
  //     );
  // }


  // $(window).scroll(function(){

  //   var wScroll = $(window).scrollTop() + $(window).height()
  //   // console.log(getDocHeight())

  //   var wScrollPercent = Math.floor((wScroll*100)/getDocHeight())
  //   console.log(Math.floor((wScroll*100)/getDocHeight()))

  //   $('.line').css('width', wScrollPercent+ '%')

  // });


});

