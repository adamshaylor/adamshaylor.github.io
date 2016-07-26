$(function() {

  var $projects = $('.home-project');
  var $firstProject = $projects.first();
  window.shaylor.homeSelectedProject = $firstProject.attr('data-slug');
  var $selectedProject = $projects.filter('[data-slug="' + window.shaylor.homeSelectedProject + '"]');
  var $unselectedProjects = $projects.not($selectedProject);
  var durations = window.shaylor.design.animationDefaults.durationsInSeconds;

  $selectedProject.addClass('home-project-selected');
  collapse($unselectedProjects, 0);

  function collapse($elements) {

    $elements.addClass('home-project-collapsed');

  }

  function expand($elements) {

    $elements.removeClass('home-project-collapsed');

  }

  function handlePrefetch() {

    $('body').addClass('home-projects-prefetched');

  }

  function handleUnselectedProjectPress() {

    var $clickedProject = $(this);
    var $otherProjects = $('.home-project').not($clickedProject);

    $selectedProject = $clickedProject;
    $otherProjects.removeClass('home-project-selected');
    $selectedProject.addClass('home-project-selected');

    collapse($otherProjects);
    setTimeout(function() {
      expand($selectedProject);
    }, durations.medium);

    return false;

  }

  function handleProjectLinkPress(event) {

    event.preventDefault();

    var smoothState = $('#smooth-state-container').data('smoothState');
    var $link = $(this);
    var projectIsSelected = $link.is('.home-project-selected .home-project-link, .home-project-selected .home-project-button');
    var breakpointIsSmall = $('body').is('.breakpoint-small');

    if (projectIsSelected || breakpointIsSmall) {
      smoothState.load($link.attr('href'));
    }

  }

  function handleProjectButtonMouseEnter() {

    var $project = $(this).parents('.home-project');
    $project.find('.home-project-button').addClass('home-project-button-indicate');

  }

  function handleProjectButtonMouseLeave() {

    var $project = $(this).parents('.home-project');
    // TODO: use pure JS animation and use TimelineLite to make it a bit more interesting
    $project.find('.home-project-button').removeClass('home-project-button-indicate');

  }

  $('body')
    .on('shaylor-prefetched', handlePrefetch)
    .on('click touchend', '.home-project:not(.home-project-selected)', handleUnselectedProjectPress)
    .on('click touchend', 'a.home-project-link, a.home-project-button', handleProjectLinkPress)
    .on('mouseenter', '.home-project-selected .home-project-link, .home-project-selected .home-project-button', handleProjectButtonMouseEnter)
    .on('mouseleave', '.home-project-selected .home-project-link, .home-project-selected .home-project-button', handleProjectButtonMouseLeave);

});
