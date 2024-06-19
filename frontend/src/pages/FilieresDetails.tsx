import React from "react";
import { useParams } from "react-router-dom";

const FiliereDetails = () => {
  const { filiereName } = useParams<{ filiereName: string }>();

  return (
    <div>
      <h1>Details for {filiereName}</h1>
      {/* Ajoutez ici les détails supplémentaires que vous souhaitez afficher */}
    </div>
  );
};

export default FiliereDetails;
