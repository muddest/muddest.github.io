data.sort(function(a,b){
                    console.log('A date: ', a.date);
                    console.log('B date: ', b.date);
                    console.log('Minus: ', new Date(a.date) - new Date(b.date));
                    return new Date(a.date) - new Date(b.date);
                });

AIzaSyAlWqxnR28KzpO-Pzt51k2qtWw61nZhRRE