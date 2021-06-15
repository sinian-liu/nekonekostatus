"use strict";
const fs=require("fs");
module.exports=svr=>{
const {db,pr,parseNumber}=svr.locals;
var rt=require("express").Router();
rt.post("/admin/servers/add",async(req,res)=>{
    var {sid,name,data,top,status}=req.body;
    if(!sid)sid=uuid.v1();
    db.servers.ins(sid,name,data,top,status);
    res.json(pr(1,sid));
});
rt.get("/admin/servers/add",(req,res)=>{
    res.render(`admin/servers/add`,{});
});
rt.post("/admin/servers/:sid/edit",async(req,res)=>{
    var {sid}=req.params,{name,data,top,status}=req.body;
    db.servers.upd(sid,name,data,top);
    if(status!=null)db.servers.upd_status(sid,status);
    res.json(pr(1,'修改成功'));
});
rt.post("/admin/servers/:sid/del",async(req,res)=>{
    var {sid}=req.params;
    db.servers.del(sid);
    res.json(pr(1,'删除成功'));
});
rt.post("/admin/servers/:sid/init",async(req,res)=>{
    var {sid}=req.params;    
    res.json(await initServer(sid));
});
rt.post("/admin/servers/:sid/restore",async(req,res)=>{
    var {sid}=req.params;
    res.json(await backend.restoreServer(sid));
});
rt.post("/admin/servers/:sid/action",async(req,res)=>{
    var {sid}=req.params,{opt}=req.body;
    res.json(await backend.action(sid,opt));
});
rt.get("/admin/servers",(req,res)=>{
    res.render("admin/servers",{
        servers:db.servers.all()
    })
});
rt.get("/admin/servers/:sid",(req,res)=>{
    var {sid}=req.params,server=db.servers.get(sid);
    res.render(`admin/servers/edit`,{
        server,
    });
});

rt.get("/get-neko-status",async(req,res)=>{
    var path=__dirname+'/neko-status';
    if(!fs.existsSync(path)){
        await fetch("文件url", {
            method: 'GET',
            headers: { 'Content-Type': 'application/octet-stream' },
        }).then(res=>res.buffer()).then(_=>{
            fs.writeFileSync(path,_,"binary");
        });
    }
    res.sendFile(path);
})
svr.use(rt);
}