/* Intro: loader del león -> (al terminar de cargar) animación UNEMI -> sitio */
(function(){
  var el=document.getElementById('intro');
  if(!el) return;
  var html=document.documentElement;
  html.classList.add('intro-on');
  var reducir=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t0=Date.now(), MIN_LEON=reducir?300:1800, MAX_ESPERA=9000;
  var iniciada=false, terminada=false, timerFin=null;

  function terminar(){
    if(terminada) return; terminada=true;
    clearTimeout(timerFin);
    el.classList.add('fase-salida');
    setTimeout(function(){
      el.style.display='none';
      html.classList.remove('intro-on');
      window.dispatchEvent(new Event('intro:fin'));
    }, 650);
  }
  function final(){
    if(iniciada) return; iniciada=true;
    el.classList.remove('fase-leon');
    el.classList.add('fase-final');
    timerFin=setTimeout(terminar, reducir?900:4700);
  }
  function listo(){
    setTimeout(final, Math.max(0, MIN_LEON-(Date.now()-t0)));
  }
  if(document.readyState==='complete') listo(); else window.addEventListener('load', listo);
  setTimeout(final, MAX_ESPERA);

  var omitir=el.querySelector('.intro-omitir');
  if(omitir) omitir.addEventListener('click', terminar);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') terminar(); });
})();
