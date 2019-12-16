import WithRepoBasic from "../../components/WithRepoBasic";
function Issues({ test }) {
  return <span>issues {test}</span>;
}
Issues.getInitialProps = async () => {
  return {
    test: 11
  };
};
export default WithRepoBasic(Issues, "issues");
