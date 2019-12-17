import { Select, Spin } from "antd";
import { debounce } from "lodash";
import { useState, useCallback, useRef } from "react";
import api from "../libs/api";
function SearchUser({ value, onChange }) {
  let lastFetchIdRef = useRef(0); // {current: 0}

  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchUser = useCallback(
    debounce(value => {
      if (value === "") {
        return;
      }
      lastFetchIdRef.current += 1;
      const fetchId = lastFetchIdRef.current;
      setFetching(true);
      setOptions([]);
      api
        .request({
          url: `/search/users?q=${value}`
        })
        .then(res => {
          if (fetchId !== lastFetchIdRef.current) {
            return;
          }
          const data = res.data.items.map(user => ({
            text: user.login,
            value: user.login
          }));
          setFetching(false);
          setOptions(data);
        });
    }, 500),
    []
  );
  const changeHandler = v => {
    setOptions([]);
    setFetching(false);
    onChange(v);
  };
  return (
    <Select
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
      filterOption={false}
      placeholder="创建者"
      allowClear={true}
      value={value}
      onChange={changeHandler}
      autoClearSearchValue={false}
      onSearch={fetchUser}
      style={{ width: 200 }}
    >
      {options.map(option => (
        <Select.Option value={option.value} key={option.value}>
          {option.text}
        </Select.Option>
      ))}
    </Select>
  );
}
export default SearchUser;
