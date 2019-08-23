(function(){
    let status={
        pending:0,
        fulfilled:1,
        rejected:2
    }
    class CustomePromise{
        constructor(func){
            this._status=status.pending
            this._value=null;//记录resolve传入的值
            this._error=null
            //收集成功状态要执行的函数
            this.resolvedArr=[];
            //收集失败状态要执行的函数
            this.rejectedArr=[]
            this._handler(func)

        }
        //判断value有没有then函数
        _getThen(val){
            let type =typeof val;
            if(val && (type==='object'||type==='Function')){
                let then;
                if(then=val.then){
                    return then
                }
                return null;
            }

        }
        //接收外部传入的函数
        _handler(func){
            let done=false
           func((value)=>{
               //成功
               if(done)return
               done=true
               //value 有没有then函数
               let then=this. _getThen(value)
               if(then){
                   //拿到对象的then之后，怎么知道这个promise对象完成了
                   //在then函数上注册成功和失败的函数
                 
                   return this._handler(then.bind(value))
               }
               this._resolve(value)

           },(error)=>{
            if(done)return
            done=true
        
             let then=this. _getThen(error)
             if(then){
            
                 return this._handler(then.bind(error))
             }
            this._reject(error)
           })

        }
        _resolve(value){
            setTimeout(()=>{
                this._value=value
                this._status=status.fulfilled
                //执行所有的成功函数
                this.resolvedArr.forEach(item => item(this._value));
            })
        
        }
        _reject(error){
            setTimeout(()=>{
                this._error=error
                this._status=status.rejected
                //执行所有失败的函数
                this.rejectedArr.forEach(item => item(this._error));
            })
           
        }
        //收集成功状态或者失败状态要执行的函数
        _done(resolvedFun,rejectedFun){
            if(this._status===0){
                if( typeof resolvedFun==='function') this.resolvedArr.push(resolvedFun)
                if( typeof rejectedFun==='function') this.rejectedArr.push(rejectedFun)
            }else if(this._status===1&&resolvedFun==='funtion'){
                resolvedFun(this._value)
                console.log(resolvedFun,'resolvedFun')
            }else if(this._status===2&&rejectedFun==='funtion'){
                 rejectedFun(this._error)
            }
        }
        //收集注册的成功状态或者失败状态要执行的函数
        then(resolvedFun,rejectedFun){
            this._done(resolvedFun,rejectedFun)
            //链式调用
            //then返回的是一个promise
            return new CustomePromise((resolve,reject)=>{
                this._done((value)=>{
                    if(typeof value !=='function'){
                        resolve(value)
                    }else{
                        resolve(resolvedFun(value))
                    }
                
                },(error)=>{
                    if(typeof value !=='function'){
                        reject(value)
                    }else{
                        reject(rejectedFun(value))
                    }
                   
                })
            })
        }

    }

    window.CustomePromise=CustomePromise





})()