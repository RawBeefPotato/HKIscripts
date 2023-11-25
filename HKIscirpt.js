
  Chart.register(ChartDataLabels);
  Chart.defaults.font.family = "Satoshi";
  Chart.defaults.font.size = 14;
  Chart.defaults.font.weight = 'normal';
  const progresslabels = [];
  const progressdata = [];
  const ctx = document.getElementById('progressBarChart');			
  const progressChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: progresslabels,
      datasets: [{
        label: 'Fortschritt',
        data: progressdata,
        borderWidth: 1,
        backgroundColor: '#C3A000',
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { datalabels: {
        color: 'black',
        anochor: 'end',
        align: 'center',
        clamp: false,
        formatter: function(value, context) { // Show the label instead of the value
                return context.chart.data.labels[context.dataIndex];
            }
            }
               },
      legend: { labels: {display: false,
                        }},
      scales: {
        /*y: [{
            ticks: {
                mirror: true
            }
        }],*/
        x: {
          max: 100,
          beginAtZero: true,
        }
      }
    },
  });
  const topicvideoplayer = document.getElementById('tvplayer');
  window.addEventListener('DOMContentLoaded', (event) => { var topicvideoplayer =  videojs('tvplayer',{
    autoplay: true,
    controls: true,
    aspectRatio: "16:9",
    preload: 'auto',
    playbackRates:[1,1.5,2,2.5,3,3.5,4],
  });
                                                          topicvideoplayer.qualitySelectorHls();
                                                         });
  if (topicvideoplayer.addEventListener) {
    topicvideoplayer.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    }, false);
  } else {
    topicvideoplayer.attachEvent('oncontextmenu', function() {
      window.event.returnValue = false;
    });
  }

  window.onload = async () => {
  Wized.data.listen("v.events", async () => {
      mobiscroll.setOptions({
        locale: mobiscroll.localeDe,
        theme: 'ios',
        themeVariant: 'light',
        clickToCreate: false,
        dragToCreate: false,
        dragToMove: false,
        dragToResize: false,
        eventDelete: false,
      });
     var inst = mobiscroll.eventcalendar('#eventcalendar', 
                                          {
        view: { calendar: {type: 'month',
                           size: 3,
                           labels:true
                          }
              },
        height: 'auto',
        renderHeader: function () {
          return '<div mbsc-calendar-nav></div>' +
            '<div class="quarter-year-header-picker">' +
            '<label>Quartal<input mbsc-segmented type="radio" name="view" value="quarter" class="md-quarter-year-change" checked></label>' +
            '<label>Jahr<input mbsc-segmented type="radio" name="view" value="year" class="md-quarter-year-change"></label>' +
            '</div>' +
            '<div mbsc-calendar-prev class="quarter-year-header-prev"></div>' +
            '<div mbsc-calendar-today class="quarter-year-header-today"></div>' +
            '<div mbsc-calendar-next class="quarter-year-header-next"></div>';
        },
        onEventClick: function (event, inst) {mobiscroll.toast({message: event.event.title
                                                               });
                                             }


      });

      var agd = mobiscroll.eventcalendar('#eventagenda', 
                                         {locale: mobiscroll.localeDe, 
                                          theme: 'ios',
                                          themeVariant: 'light',
                                          view: { agenda: {type: 'year',

                                                           labels: true,
                                                          }
                                                },
                                          onEventClick: function (event, inst) {mobiscroll.toast({message: event.event.title  });
                          }});
      const userevents = await Wized.data.get("v.events");
      console.log(userevents);
      inst.setEvents(userevents);
      agd.setEvents(userevents);
      document.querySelectorAll('.md-quarter-year-change').forEach(function (elm) {
        elm.addEventListener('change', function (ev) {
          switch (ev.target.value) {
            case 'quarter':
              inst.setOptions({
                view: {
                  calendar: { type: 'month', size: 3,     labels:true }
                },
                height: 'auto'
              })
              break;
            case 'year':
              inst.setOptions({
                view: {
                  calendar: { type: 'year',     labels:true }
                },
                height: '100%'
              })
              break;
          }
        });
      });
    });
    Wized.data.listen("v.audio", async () => {
      var audiosforplayer = await Wized.data.get("v.audio");
      console.log(audiosforplayer)
      setTimeout(() => {
        let songElements = document.getElementsByClassName('song');
        for( var i = 0; i < songElements.length; i++ ){
          document.getElementsByClassName('.song .amplitude-song-container .amplitude-play-pause');
          Amplitude.init({
            "songs": audiosforplayer,
            "callbacks": {
              'play': function(){
                document.getElementById('album-art').style.visibility = 'hidden';
                document.getElementById('large-visualization').style.visibility = 'visible';
              },
              'pause': function(){
                document.getElementById('album-art').style.visibility = 'visible';
                document.getElementById('large-visualization').style.visibility = 'hidden';
              }
            },
          });	};
      },
        1000);
      });
    Wized.data.listen("v.progresslabels", async () => {
      const progresslabels = await Wized.data.get("v.progresslabels");
      const progressdata = await Wized.data.get("v.progressdata");
      progressChart.data.labels = progresslabels;
      progressChart.data.datasets[0].data = progressdata;
      progressChart.update();
      console.log(progresslabels, progressdata);
      console.log("Chart updated!");
    });
    Wized.data.listen("v.video_src", async () => {
      const video = await Wized.data.get("v.video_src");
      console.log(video);
      videojs.getPlayer('tvplayer').src({type: 'application/x-mpegURL',
src: video});
});
    Wized.request.await('Load User Topic', (response) => {
      setTimeout(() => {swiper.updateSlides();
                        swiper.updateProgress();
                        swiper.updateSlideClasses();},1000);
    });
  };
  document.querySelector('#tvplayer').onended = async function() {
    if(this.played.end(0) - this.played.start(0) === this.duration) {
      await Wized.data.setVariable('watched', 'true')
    }else {
      await Wized.data.setVariable('watched', 'false');
    }
    const value = await Wized.data.get('v.watched');
    console.log(value);
  };
  //Quill Js Script 
  var quillnoteblock = new Quill('#noteblock', {
    modules: {
      toolbar: [['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],                        
                [{ 'header': [1, 2, 3, false] }],
                [{ 'color': [] }, { 'background': [] }],       
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean']]},
    theme: 'snow'
  });
  async function exportPDF(){
    const delta = quillnoteblock.getContents();
    const blob = await QuillToPdf.pdfExporter.generatePdf(delta);
    saveAs(blob, "HKI-Notiz.pdf")
  };
  $('#exportPDF').click(exportPDF);
  $('#clearnotebook').click(function clearnotebook(){quillnoteblock.setContents([{ insert:'\n'}]);})
quillnoteblock.on('text-change', function(delta, oldDelta, source) { document.querySelector('#editorTextareaTopic').innerHTML =JSON.stringify(quillnoteblock.getContents()); 
 document.querySelector('#editorTextareaTopic').dispatchEvent(new Event('change')); 
 });
var quillforumblock = new Quill('#forumblock', {
   modules: {
      toolbar: [['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],                        
                [{ 'header': [1, 2, 3, false] }],
                [{ 'color': [] }, { 'background': [] }],       
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean']]},
    theme: 'snow'
  });
quillforumblock.on('text-change', function() { document.querySelector('#editorTextareaForum').innerHTML = quillforumblock.root.innerHTML; 
 document.querySelector('#editorTextareaForum').dispatchEvent(new Event('change')); 
 });
var quillnoteblockmobile = new Quill('#noteblockmobile', {
    modules: {
      toolbar: [['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],                        
                [{ 'header': [1, 2, 3, false] }],
                [{ 'color': [] }, { 'background': [] }],       
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean']]},
    theme: 'snow'
  });
  async function exportPDFmobile(){
    const delta = quillnoteblockmobile.getContents();
    const blob = await QuillToPdf.pdfExporter.generatePdf(delta);
    saveAs(blob, "HKI-Notiz.pdf")
  };
  $('#exportPDFmobile').click(exportPDFmobile);
  $('#clearnotebookmobile').click(function clearnotebook(){quillnoteblockmobile.setContents([{ insert:'\n'}]);})
quillnoteblockmobile.on('text-change', function(delta, oldDelta, source) { document.querySelector('#editorTextareaTopicMobile').innerHTML =JSON.stringify(quillnoteblockmobile.getContents()); 
 document.querySelector('#editorTextareaTopicMobile').dispatchEvent(new Event('change')); 
 });
  const swiper = new Swiper('.swiper' ,  {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
