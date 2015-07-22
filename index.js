var app = angular.module('ColorApp', ['ui.bootstrap']);

function ColorFamily(color, variant) {
  this.color = color;
  if (variant) this.variant = variant;
}

function getDefaultTextHex(is_dark) {
  return is_dark ? 'f7f7f7' : '333';
}

// Generates demo-specific CSS
app.directive('paletteStyle', function() {
  return {
    restrict: 'A',
    templateUrl: 'demo.css',
    scope: {
      palette: '=',
      index: '=',
    },
  };
});

/* :param background: hex string
   :param primary: [hex for main color, hex for area color]
   :param secondary: [hex for main color, hex for area color]
*/
function Palette(params) {
  var self = this;
  angular.extend(this, params);
  this.text = params.text || getDefaultTextHex(this.is_dark);
  if (params.background) {
    this.background = params.background;
  }
  if (params.primary) {
    this.primary = new ColorFamily(params.primary[0], params.primary[1]);
  }
  if (params.secondary) {
    this.secondary = new ColorFamily(params.secondary[0], params.secondary[1]);
  }
  if (params.highlight) {
    this.highlight = params.highlight;
  }

  this.toArray = function() {
    var arr = [self.background, self.primary.color, self.primary.variant];
    if (self.secondary) arr.push(self.secondary.color, self.secondary.variant);
    return _.filter(arr, function(color) { return color; });
  };
  this.getPrimaryFill = function() {
    return self.primary.variant || self.primary.color;
  };
  this.getSecondary = function() {
    return (self.secondary ? self.secondary.color : null) || self.primary.color;
  };
  this.getSecondaryFill = function() {
    var col = self.secondary ?
              (self.secondary.variant || self.secondary.color) :
              null;
    return col || self.getPrimaryFill();
  };
}

app.controller('ColorCtrl', function($scope) {
  $scope.palettes = _.map(palettes, function(palette) {
    return new Palette(palette);
  });

  $scope.fullscreen = function(demoIndex) {
    $('.demo' + demoIndex)
      .addClass('fullscreen');
    $(document).keyup(function(e) {
      if (e.keyCode == 27) {  // escape
        $scope.exitFullscreen();
      }
    });
  };

  $scope.exitFullscreen = function() {
    $('.demo.fullscreen').each(function() {
      $(this).removeClass('fullscreen');
    });
  };

});
