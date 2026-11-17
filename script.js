(function(){
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add("in");
      var c = e.target.querySelector("[data-count]");
      if(c) count(c);
      io.unobserve(e.target);
    });
  },{threshold:.2});
  document.querySelectorAll(".rv").forEach(function(el){io.observe(el)});

  function count(el){
    var to = +el.dataset.count, t0 = null;
    if(reduce){el.textContent = to.toLocaleString("id-ID"); return;}
    function step(t){
      if(!t0) t0 = t;
      var p = Math.min((t - t0)/1600,1);
      el.textContent = Math.round(to*(1-Math.pow(1-p,3))).toLocaleString("id-ID");
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var bar = document.getElementById("progress");
  var nav = document.getElementById("nav");
  var layers = document.querySelectorAll(".strata svg");
  var player = document.getElementById("player");
  var ticking = false;
  function update(){
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h>0 ? y/h : 0) + ")";
    nav.classList.toggle("stuck", y > innerHeight*0.6);
    if(!reduce){
      layers.forEach(function(s){ s.style.transform = "translateY(" + (-y*parseFloat(s.dataset.speed)) + "px)"; });
      var r = player.getBoundingClientRect();
      var v = 1 - Math.abs((r.top + r.height/2) - innerHeight/2)/innerHeight;
      player.style.transform = "scale(" + (0.93 + 0.07*Math.max(0,Math.min(1,v*1.5))).toFixed(3) + ")";
    }
    ticking = false;
  }
  addEventListener("scroll", function(){ if(!ticking){ticking = true; requestAnimationFrame(update);} },{passive:true});
  addEventListener("resize", update);
  update();

  var vid = document.getElementById("vid");
  var file = document.getElementById("file");
  document.getElementById("pick").addEventListener("click", function(){file.click()});
  file.addEventListener("change", function(){
    var f = file.files && file.files[0];
    if(!f) return;
    vid.src = URL.createObjectURL(f);
    player.classList.add("loaded");
    vid.play().catch(function(){});
  });
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!vid.src) return;
      if(e.isIntersecting){ vid.play().catch(function(){}); } else { vid.pause(); }
    });
  },{threshold:.5}).observe(player);

  document.querySelectorAll(".person input").forEach(function(inp){
    inp.addEventListener("change", function(){
      var f = inp.files && inp.files[0];
      if(!f) return;
      var p = inp.closest(".person"), img = p.querySelector("img");
      img.src = URL.createObjectURL(f);
      img.hidden = false;
      p.classList.add("has");
    });
  });
})();
