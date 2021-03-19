import React from "react";

const RenderPages = ({ pages }) => {
  return (
    <div className="row">
  {pages.map(page => (
    <div key={page.pageid} className="col s12 m8 offset-m2">
      <a className="card horizontal" href={page.canonicalurl} target="_blank" rel="noreferrer">
      {page.original && (
        <div className="card-image">
        <img src={page.original.source} alt={page.pageimage}/>
        </div>
      )}
        <div className="card-stacked">
          <h5 className="card-title black-text">{page.title}</h5>
          <div className="card-content black-text">
            <p>{page.extract}</p>
          </div>
        </div>
      </a>
    </div>
    ))
  }
    </div>
  )      
};


export default RenderPages;
