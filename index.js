var app = angular.module('ColorApp', ['ui.bootstrap']);

// enum
var Purpose = Object.freeze({
  TEXT: 0,
  AREA: 1,
});

function Color(hex, purpose) {
  this.hex = hex;
  this.purpose = purpose || Purpose.TEXT;
}

function ColorFamily(color, variant) {
  this.color = new Color(color, Purpose.TEXT);
  if (variant) {
    this.variant = new Color(variant, Purpose.AREA);
  }
}

function getDefaultTextHex(is_dark) {
  return is_dark ? 'f7f7f7' : '333';
}

// Generates demo-specific CSS
app.directive('paletteStyle', function () {
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
  this.text = new Color(params.text || getDefaultTextHex(this.is_dark), Purpose.TEXT);
  if (params.background) {
    this.background = new Color(params.background, Purpose.AREA);
  }
  if (params.primary) {
    this.primary = new ColorFamily(params.primary[0], params.primary[1]);
  }
  if (params.secondary) {
    this.secondary = new ColorFamily(params.secondary[0], params.secondary[1]);
  }
  if (params.highlight) {
    this.highlight = new Color(params.highlight, Purpose.AREA);
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

app.controller('ColorCtrl', function($scope, $http) {
  $scope.Purpose = Purpose;

  $scope.palettes = _.map(palettes, function (palette) {
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
