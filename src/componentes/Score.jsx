import "../css/score.css";

const Score = ({ ranking }) => {
  return (
    <div className="score mt-5">
      <div>
        <h4>SCORES</h4>
      </div>
      <ol className="list-group mt-5">
        {Array.isArray(ranking) &&
          ranking.map((score, index) => {
            return (
              <li key={index} className="list-group-item">
                Player: {score.player} || Score: {score.score}
              </li>
            );
          })}
      </ol>
    </div>
  );
};

export default Score;
