import React from "react";

const RenderPages = ({ pages }) => {
  return (
    <div className="row">
  {pages.map(page => (
    <div key={page.pageid} className="col s12 m8 offset-m2">
            <a className="card horizontal" href={page.canonicalurl} target="_blank" rel="noreferrer">
            {}
              <div className="card-image">
                {page.original && <img src={page.original.source} alt={page.pageimage}/>}
                {/* {!page.original && <img src="https://phocode.com/wp-content/uploads/2020/10/placeholder-1-1.png" alt="placeholder"/>} */}
              </div>
              <div className="card-stacked">
                <h4 className="card-title black-text">{page.title}</h4>
                <div className="card-content black-text">
                  <p>{page.extract}</p>
                </div>
              </div>
            </a>
          </div>
          ))
          }
    </div>)
          
};


export default RenderPages;
