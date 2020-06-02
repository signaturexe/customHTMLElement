/** Create a class which acts as the implementation for your custom HTML element **/

class UserInputComponent extends HTMLElement{
    //Call to constructor
    constructor() {
        //call to super() to access parents' properties and methods.
        super();
        
        /* Create Shadow Root */
        //You create this basically as a fork of main DOM branch, work on that DOM and then integrate in the main DOM
        //Acts similar to git--> Create Feature Branch and then merge into Main Branch.
        const shadowRoot = this.attachShadow({ mode: 'open' }); //keep it const to avoid accidental overrides.

        /* Create Parent Div*/
        let parent_div = document.createElement("div"); //container div       

        //1. Create first dropdown
        let releases_div = document.createElement("div");
        releases_div.classList.add("col"); //adds bootstraps col class.
        let releases_path = "your_path"
        let releases_request = {
            url: releases_path,
            success: function (e) {
                let releases_dd = document.createElement("select");
                
                e.forEach(function (item) {                        
                    let releases_dd_opt_1 = document.createElement("option");
                    releases_dd_opt_1.value = item.ReleaseName;
                    releases_dd_opt_1.text = item.ReleaseName;
                    releases_dd.add(releases_dd_opt_1, null);
                });                    

                //Attach to shadowRoot
                releases_div.append(releases_dd);
            }
        }
        $.get(releases_request).fail(function () {
            alert("Failed to load Releases.");
        });
       

        /* Create a Second Select Element */            
            var path = "your_path";
            let request = {
                url: path,
                success: function (e) {
                    let tech_exec_dd = document.createElement("select");
                    tech_exec_dd.classList.add("col");
                    e.forEach(function (item) {                        
                        let tech_exec_dd_opt_1 = document.createElement("option");
                        tech_exec_dd_opt_1.value = item.TechExecNBK;
                        tech_exec_dd_opt_1.text = item.CTO;
                        tech_exec_dd.add(tech_exec_dd_opt_1, null);
                    });                    
                    
                    parent_div.append(tech_exec_dd);
                }
            }
            $.get(request).fail(function () {
                alert("Failed to load Tech Exec.");
            });        

        //Attach dropdowns to parent div 
        parent_div.append(releases_div);
        
        //Attach parent div to shadowRoot or shadow DOM.
        shadowRoot.append(parent_div);        
    }   
    
} //Class ends

/*****  (DO NOT DELETE THE NEXT LINE!)Define the new element 
        Description: Register your Components in the customElements Registry. This registry is exposed as an Object.
*****/
customElements.define('user-input-div', UserInputComponent);


/***** CORE FUNCTIONS
    Desc: These are common functions shared by different functions in this script.
          Function returns promises.
*****/

/* 1.  HTTP Async Call
   Desc: uses Promises instead of callbacks. In future, we should use Observables for added flexibility
*/
function makeAsyncHttpCall(request) {

    let promise = new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(request.method, request.path, request.asyncFlag);

        /* Is the request GET or POST?
           Note: assuming requests are not sending any other HTTP verbs
        */
        if (request.method === "GET") {
            xhr.send();
        } else if (request.method === "POST") {
            /* For POST requests set the content type in the header

            */
            xhr.setRequestHeader('Content-type', request.contentType);
            xhr.send(request.bodyParams);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log("response code received 200");
                    let response = JSON.parse(xhr.response);
                    //console.log("Response received in promise call: " + JSON.stringify(response));
                    resolve(response);
                } else {
                    reject(xhr.status);
                    console.log("XHR call failed.");
                }
            } else {
                console.log("XHR ready state = " + xhr.readyState);
            }
        }
    });

    return promise;
}
