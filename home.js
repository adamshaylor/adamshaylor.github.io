$(function() {

  var $projects = $('.home-project');
  var $firstProject = $projects.first();
  window.shaylor.homeSelectedProject = $firstProject.attr('data-slug');
  var $selectedProject = $projects.filter('[data-slug="' + window.shaylor.homeSelectedProject + '"]');
  var $unselectedProjects = $projects.not($selectedProject);
  var durations = window.shaylor.design.animationDefaults.durationsInSeconds;

  $selectedProject.addClass('home-project-selected');
  collapse($unselectedProjects, 0);
  TweenLite.to($selectedProject.find('.home-project-image'), 0, {
    top: '0.1rem'
  });

  function collapse($elements, duration) {

    var part1Duration = 0.2 * duration;
    var part2Duration = 0.8 * duration;
    var timeline = new TimelineLite();

    $elements.each(function() {
      var $caption = $(this).find('.home-project-caption');
      var captionHeightPx = $caption.height();
      var captionHeightRem = captionHeightPx / parseFloat($('body').css('font-size'));
      timeline.to($caption, part1Duration, {
        bottom: captionHeightRem * -1 + 2.5 + 'rem'
      }, 0);
    });

    timeline.to($elements.find('.home-project-button'), part1Duration, {
      right: '3rem'
    }, 0);

    timeline.to($elements, part2Duration, {
      height: '3.1rem'
    }, part1Duration);

    timeline.to($elements.find('.home-project-image'), part2Duration, {
      top: '5rem'
    }, part1Duration);

    return timeline;

  }

  function expand($elements, duration) {

    var part1Duration = 0.5 * duration;
    var timeline = new TimelineLite();

    timeline.to($elements, part1Duration, {
      height: '23rem'
    }, 0);

    timeline.to($elements.find('.home-project-image'), part1Duration, {
      top: '0.1rem'
    }, 0);

    timeline.to($elements.find('.home-project-caption'), part1Duration, {
      bottom: '1.4rem'
    }, 0);

    timeline.to($elements.find('.home-project-button'), duration, {
      right: '0'
    }, 0);

    return timeline;

  }

  $('body').on('click', '.home-project:not(.home-project-selected)', function() {

    var $clickedProject = $(this);
    var $otherProjects = $('.home-project').not($clickedProject);

    $selectedProject = $clickedProject;
    $otherProjects.removeClass('home-project-selected');
    $selectedProject.addClass('home-project-selected');

    var timeline = collapse($otherProjects, durations.mediumShort);
    timeline.add(expand($selectedProject, durations.medium));

  });


  $('body').on('click', 'a.home-project-link, a.home-project-button', function(event) {

    event.preventDefault();

    var smoothState = $('#smooth-state-container').data('smoothState');
    var $link = $(this);
    var projectIsSelected = $link.is('.home-project-selected .home-project-link, .home-project-selected .home-project-button');
    var breakpointIsSmall = $('body').is('.breakpoint-small');

    if (projectIsSelected || breakpointIsSmall) {
      smoothState.load($link.attr('href'));
      return;
    }

  });

  $('body').on('mouseenter', '.home-project:not(.home-project-selected)', function() {

    var $image = $(this).find('.home-project-image');
    TweenLite.to($image, durations.short, {
      top: '0.1rem'
    });

  });

  $('body').on('mouseleave', '.home-project:not(.home-project-selected)', function() {

    var $image = $(this).find('.home-project-image');
    TweenLite.to($image, durations.short, {
      top: '5rem'
    });

  });

  $('body').on('mouseenter', '.home-project-selected .home-project-link, .home-project-selected .home-project-button', function() {

    var $project = $(this).parents('.home-project');
    // TODO: use pure JS animation and use TimelineLite to make it a bit more interesting
    $project.find('.home-project-button').addClass('home-project-button-indicate');

  });

  $('body').on('mouseleave', '.home-project-selected .home-project-link, .home-project-selected .home-project-button', function() {

    var $project = $(this).parents('.home-project');
    // TODO: use pure JS animation and use TimelineLite to make it a bit more interesting
    $project.find('.home-project-button').removeClass('home-project-button-indicate');

  });

});
