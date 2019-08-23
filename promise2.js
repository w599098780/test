(function(){
    let status={
        pending:0,
        fulfilled:1,
        reject:2
    }
    class CustomePromise{
        constructor(func){
            this.status=status.pending
            this._value=null;
            this._error=null;
            this.resolvedArr=[];
            this.rejectedArr=[];
            //处理外部传进来的函数
            this._handler(func)

        }
        _getThen(value){
            let type=typeof value
          
            if(value && (type==='object'||type==='function')){
                let then=value.then
                if(then){
                    return then
                }
                return null
            }

        }
        _handler(func){
            let done=false
            func((value)=>{
                //成功
                if(done)return
                done=true
                //value 有没有then函数
               let then= this._getThen(value)
               if(then){
                   return _handler(then.bind(value))
               }
                this._resolve(value)

            },(error)=>{
                //失败
                if(done)return
                done=true
                let then= this._getThen(value)
               if(then){
                   return _handler(then.bind(value))
               }
                this._reject(error)
            })

        }
        _resolve(value){
            setTimeout(()=>{
                this._value=value
                this._status=status.fulfilled
                this.resolvedArr.forEach(item=>item(value))

            })

        }
        _reject(error){
            setTimeout(()=>{
                this._error=error
                this._status=status.reject
                this.rejectedArr.forEach(item=>item(error))
            })

        }
        _done(resolvedFun,rejectedFun){
            if(this._status===0){
                if(typeof resolvedFun==='function')this.resolvedArr.push(resolvedFun)
                if(typeof rejectedFun==='function')this.rejectedArr.push(rejectedFun)

            }else if(this._status===1&&typeof resolvedFun==='function'){
                resolvedFun(this._value)
            }else if(this._status===2&&typeof rejectedFun==='function'){
                rejectedFun(this._error)
            }

        }
        then(resolvedFun,rejectedFun){
            this. _done(resolvedFun,rejectedFun)

            //链式调用
            return new CustomePromise((resolve,reject)=>{
                this._done((value)=>{
                    if(typeof value !=='function'){
                        resolve(value)
                    }else{
                        resolve(resolvedFun(value))
                    }

                })
            },(error)=>{
                if(typeof error !=='function'){
                    reject(error)
                }else{
                    reject(rejectedFun(error))
                }
            })

        }
    }

})()
