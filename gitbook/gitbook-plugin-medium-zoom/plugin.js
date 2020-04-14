require([
  'gitbook'
], function(gitbook) {
  const options = {
    margin: 0,
    background: '#fff',
    scrollOffset: 40
  };

  const init = function() {
    mediumZoom("img", options);
  }

  gitbook.events.bind('start', function(e, config){ 
    const configOption = config['medium-zoom'];
    if (configOption) {
      for (const item in options) {
        if (options.hasOwnProperty(item) && (item in configOption)) {
          options[item] = configOption[item];
        }
      }
    }
  });

  gitbook.events.bind('page.change', function(e, config) {
    init();
  });
});