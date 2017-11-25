var fs = require('fs');

var template = "router.get('/{name}.html',function(req,res){\n\tres.render('{name}');\n});\n\n";

var files = fs.readdirSync('../views');

var count=0;
var content = '';


for(var i=0;i<files.length;i++){
    var name = files[i];
    if(/(^[^_].*?)[.]jade$/g.test(name)){
        var m = /(^[^_].*?)[.]jade$/g.exec(name);
        count++;
        console.log(count + '.' + m[1]);

        content+=template.replace(/[{]name[}]/g,m[1]);
    }
}

fs.writeFile('jade.js',content,function(err){
    console.log('ok');
});