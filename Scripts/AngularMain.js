try {
    var t1 = window.performance.now();
} catch (ex) {
    var t1 = new Date().getTime();
}
var averages = {
    model1: {
        count: 0,
        values: []
    },
    model2: {
        count: 0,
        values: []
    },
    model3: {
        count: 0,
        values: []
    }
}

var setAverage = function (modelNumber, timeElapsed) {
    averages["model" + modelNumber].count++;
    averages["model" + modelNumber].values.push(timeElapsed);
    var total = 0;
    for (var i in averages["model" + modelNumber].values) { total += averages["model" + modelNumber].values[i]; }
    return (total / averages["model" + modelNumber].count);
}

angular.module('catApp', [])
  .controller('catController', ['$scope', function ($scope) {
      $scope.cats = CatModel1;
      try {
          var t2 = window.performance.now();
      } catch (ex) {
          var t2 = new Date().getTime();
      }
      document.getElementById("model1").innerText = setAverage(1, (t2 - t1));
      document.getElementById("initialLoad").innerText = setAverage(1, (t2 - t1));

      $scope.loadData = function (data) {
          $scope.cats = data
      };

      var modelNumber = 2;

      setInterval(function () {
            try{
          var t1 = window.performance.now();
      } catch (ex) {
          var t1 = new Date().getTime();
      }
          if (modelNumber == 1) {
              console.log("Update to model 1");

              e = document.getElementById('catApp');
              scope = angular.element(e).scope();
              // update the model with a wrap in $apply(fn) which will refresh the view for us
              $scope.$apply(function () {
                  $scope.loadData(CatModel1);
              });

              modelNumber = 2;

              try{
              var t2 = window.performance.now();
          } catch (ex) {
              var t2 = new Date().getTime();
          }
              document.getElementById("model1").innerText = setAverage(1, (t2 - t1));
          } else if (modelNumber == 2) {
              console.log("Update to model 2");

              e = document.getElementById('catApp');
              scope = angular.element(e).scope();
              // update the model with a wrap in $apply(fn) which will refresh the view for us
              $scope.$apply(function () {
                  $scope.loadData(CatModel2);
              });

              modelNumber = 3;
              try{
              var t2 = window.performance.now();
          } catch (ex) {
              var t2 = new Date().getTime();
          }
              document.getElementById("model2").innerText = setAverage(2, (t2 - t1));
          } else if (modelNumber == 3) {
              console.log("Update to model 3");

              e = document.getElementById('catApp');
              scope = angular.element(e).scope();
              // update the model with a wrap in $apply(fn) which will refresh the view for us
              $scope.$apply(function () {
                  $scope.loadData(CatModel3);
              });

              modelNumber = 1;

              try{
              var t2 = window.performance.now();
          } catch (ex) {
              var t2 = new Date().getTime();
          }
              document.getElementById("model3").innerText = setAverage(3, (t2 - t1));
          }


      }, 5000);

  } ]);


var CatModel1 = [
    {
        name: "terry",
        class: "test1",
        color: "striped black and pink",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped warts"
            },
            {
                date: "24/12/2014",
                reason: "explosive tail"
            }
        ]
    },
    {
        name: "tabby",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            }
        ]
    },
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            },
            {
                date: "12/05/2014",
                reason: "sat in paint and had to be shaved"
            }
        ]
    }
];


var CatModel2 = [
    {
        name: "terry",
        class: "test1",
        color: "striped black and pink",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped warts"
            }
        ]
    },
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            }
        ]
    },
    {
        name: "tabby update",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles update"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            },
            {
                date: "21/01/2015",
                reason: "implosive diahorrea"
            }
        ]
    },
    {
        name: "whitey",
        class: "test3",
        color: "white",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a cucumber"
            },
            {
                date: "12/05/2014",
                reason: "sat in tar and had to be shaved"
            }
        ]
    },
    {
        name: "terry",
        class: "test1",
        color: "striped black and pink",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped warts"
            }
        ]
    },
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            }
        ]
    },
    {
        name: "tabby update",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles update"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            },
            {
                date: "21/01/2015",
                reason: "implosive diahorrea"
            }
        ]
    },
    {
        name: "whitey",
        class: "test3",
        color: "white",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a cucumber"
            },
            {
                date: "12/05/2014",
                reason: "sat in tar and had to be shaved"
            }
        ]
    },
    {
        name: "terry",
        class: "test1",
        color: "striped black and pink",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped warts"
            }
        ]
    },
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            }
        ]
    },
    {
        name: "tabby update",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles update"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            },
            {
                date: "21/01/2015",
                reason: "implosive diahorrea"
            }
        ]
    },
    {
        name: "whitey",
        class: "test3",
        color: "white",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a cucumber"
            },
            {
                date: "12/05/2014",
                reason: "sat in tar and had to be shaved"
            }
        ]
    },
    {
        name: "terry",
        class: "test1",
        color: "striped black and pink",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped warts"
            }
        ]
    },
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            }
        ]
    },
    {
        name: "tabby update",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles update"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            },
            {
                date: "21/01/2015",
                reason: "implosive diahorrea"
            }
        ]
    },
    {
        name: "whitey",
        class: "test3",
        color: "white",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a cucumber"
            },
            {
                date: "12/05/2014",
                reason: "sat in tar and had to be shaved"
            }
        ]
    },
    {
        name: "terry",
        class: "test1",
        color: "striped black and pink",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped warts"
            }
        ]
    },
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            }
        ]
    },
    {
        name: "tabby update",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles update"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            },
            {
                date: "21/01/2015",
                reason: "implosive diahorrea"
            }
        ]
    },
    {
        name: "whitey",
        class: "test3",
        color: "white",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a cucumber"
            },
            {
                date: "12/05/2014",
                reason: "sat in tar and had to be shaved"
            }
        ]
    },
    {
        name: "terry",
        class: "test1",
        color: "striped black and pink",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped warts"
            }
        ]
    },
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            }
        ]
    },
    {
        name: "tabby update",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles update"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            },
            {
                date: "21/01/2015",
                reason: "implosive diahorrea"
            }
        ]
    },
    {
        name: "whitey",
        class: "test3",
        color: "white",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a cucumber"
            },
            {
                date: "12/05/2014",
                reason: "sat in tar and had to be shaved"
            }
        ]
    }
];

var CatModel3 = [
    {
        name: "whitey",
        class: "test3",
        color: "white",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a cucumber"
            }
        ]
    }
];