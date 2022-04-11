import serviceUrl from '../../Assets/Script/Service';
const {been_url,method,headers,been_urlP01} = serviceUrl;
export const postService = async(apiname,params)=>{
  
    const url = been_url +'/'+ apiname;
    try {
        const response = await fetch(url, {
          method: method,
          headers:headers,
          body: JSON.stringify(params)
          });
          
        const responseJson = await response.json();
        console.log('response from api service',responseJson)
        return responseJson;
        
        }catch(error){
            console.log("Error from api services:",error);
            throw new Error('something error:'+error);
        }
}

export const postImgService = async(apiname,params)=>{
    const url = been_url +'/'+ apiname;
    try {
        const response = await fetch(url, {
          method: method,
          body:params
        });
          
        const responseJson = await response.json();
        // console.log('response from api service',responseJson)
        return responseJson;
        }catch(error){
            console.log("Error from api services:",error);
            throw new Error('something error:'+error);
        }
}

export const postServiceP01 = async(apiname,params)=>{
  const url = been_urlP01 +'/'+ apiname;
  try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(params)
        });
        
      const responseJson = await response.json();
      // console.log('response from api service',responseJson)
      return responseJson;
      
      
      }catch(error){
          console.log("Error from api services:",error);
          throw new Error('something error:'+error);
      }
}

export const getService = async(apiname) =>{
  const url = been_url +'/'+ apiname;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      
      });
      
    const responseJson = await response.json();
    // console.log('response from api service',responseJson)
    return responseJson;
    
    
    }catch(error){
        console.log("Error from api services:",error);
        throw new Error('something error:'+error);
     

    }

}

