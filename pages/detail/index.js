import api from "../../libs/api";
import WithRepoBasic from "../../components/WithRepoBasic";
function Detail({ readme }) {
  console.log(readme);
  return <span>性情</span>;
}
Detail.getInitialProps = async ({
  ctx: {
    query: { owner, name },
    req,
    res
  }
}) => {
  const readmeResp = await api.request(
    {
      url: `/repos/${owner}/${name}/readme`
    },
    req,
    res
  );
  return {
    readme: readmeResp.data
  };
};
export default WithRepoBasic(Detail, "index");
