#!/usr/bin/env node
let fs=require("fs");
let path=require("path");
let inputArr=process.argv.slice(2);
let command=inputArr[0];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
switch(command){
    case "tree":
        treeFunc(inputArr[1]);
        break;
    case "organize":
        organizeFunc(inputArr[1]);
        break;
    case "help":
        helpFunc();
        break;
    default:
        console.log("plz type the right command" );
        break;
}
function treeFunc(dirpath){
    //let destinationpath;
    if(dirpath==undefined){
        treeHelper(process.cwd(),"");
        return;
    }else{
        let exist=fs.existsSync(dirpath);
        if(exist){
          treeHelper(dirpath,"");
           
        }
        else{
            console.log("plz give the correct path");
            return;
        }
    }
}
function organizeFunc(dirpath){
    let destinationpath;
    if(dirpath==undefined){
        destinationpath=process.cwd();
        return;
    }else{
        let exist=fs.existsSync(dirpath);
        if(exist){
           destinationpath=path.join(dirpath,"organizefiles");
           if(fs.existsSync(destinationpath)==false){
            fs.mkdirSync(destinationpath);
           }
           
        }
        else{
            console.log("plz give the correct path");
            return;
        }
    }
    organizedHelper(dirpath,destinationpath);
}
function helpFunc(){
    console.log(`list of the command:
                                node main.js "tree"
                                node main.js "organize"
                                node main.js "help"`);
}
function organizedHelper(src,dest){
    let allfiles=fs.readdirSync(src);
    // console.log(allfiles);
    for(let i=0;i<allfiles.length;i++){
        let chAdress=path.join(src,allfiles[i]);
        let isf=fs.lstatSync(chAdress).isFile();
        if(isf){
          let categ=getCategory(allfiles[i]);  
        //   console.log(categ); 
        sendfile(chAdress,dest,categ);
        }else{

        }
        
    }
}
function getCategory(exten){
   let ext= path.extname(exten);
   ext=ext.slice(1); 
   for(let type in types){
    let crtype=types[type];
    for(let i=0;i<crtype.length;i++){
        if(ext==crtype[i]){
            return type;
        }
    }
   }
   return "others";
}
function sendfile(srcfile,destination,category){ 
    let categorypath=path.join(destination,category);
    if(fs.existsSync(categorypath)==false){
        fs.mkdirSync (categorypath);

    }
    let fname=path.basename(srcfile);
    let destadd=path.join(categorypath,fname);
    fs.copyFileSync(srcfile,destadd);
    fs.unlinkSync(srcfile);
}
function treeHelper(dirpath,indent){
     let isit=fs.lstatSync(dirpath).isFile();
     if(isit){
       let filename= path.basename(dirpath);
       console.log(indent+"├──"+filename);
     }else{
        let dirname=path.basename(dirpath)
        console.log(indent+"└──"+dirname);
        let childrens=fs.readdirSync(dirpath)
        for(let i=0;i<childrens.length;i++){
            let child=childrens[i];
            let childpath=path.join(dirpath,child);
            treeHelper(childpath,indent+"\t");
        }
     }
}