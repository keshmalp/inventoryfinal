var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


var barchart=(name)=>
{
  window.onload = function() {



  jQuery.get('dataquantity',function(productlist) {
    var qty=[];
    var product=[];


    for(var i=0;i<productlist.length;i++)
    {
      qty.push(productlist[i].quantity);
      product.push(productlist[i].product);
    }
      var popCanvas = document.getElementById("popChart");
      var barChart = new Chart(popCanvas, {
        type: 'bar',
        data: {
          labels:product,
          datasets: [{
            label: 'Comapny',
            data: qty,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ]
          }]
        }
      });

    });
    $barChart.appendTo(document.body);
  }
};
var table=(name)=>
{
jQuery.get('data', function(productlist) {

  var tr;
  for (var i = 0; i < productlist.length; i++) {
    if (productlist[i].name == 'Adidas') {
      tr = $('<tr/>');
      tr.append("<td>" + productlist[i].name + "</td>");
      tr.append("<td>" + productlist[i].product + "</td>");
      tr.append("<td>" + productlist[i].quantity + "</td>");
      $('table').append(tr);
    }
  }

});
return table;
};

module.exports=
{
  barchart:barchart
}
