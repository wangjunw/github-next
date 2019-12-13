const { request } = require("../libs/api");
function Index({ data }) {
  return <span>Index{data.total_count}</span>;
}
Index.getInitialProps = async ({ ctx }) => {
  const result = await request(
    { url: "/search/repositories?q=react" },
    ctx.req,
    ctx.res
  );
  return {
    data: result.data
  };
};
export default Index;
