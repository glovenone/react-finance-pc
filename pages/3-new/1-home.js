import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import { Icon, Pagination, message } from "antd";
import { http } from "@utils";
import { getNewsHome } from "@actions";
import reduxPage from "@reduxPage";
import {
  Layout,
  WrapLink,
  NewTypeLink,
  NewList,
  ErrorFetch,
  LoadingFetch
} from "@components";

const util = require("util");
@reduxPage
@connect(({ newsHome }) => ({ newsHome }))
export default class extends Component {
  static async getInitialProps(ctx) {
    // err req res pathname query asPath isServer
    const { store, isServer } = ctx;
    if (!store.getState().newsHome) {
      try {
        const newsHomeFetch = await http.get(
          "information/index",
          null,
          isServer
        );
        const newsHomeData = newsHomeFetch.data;
        store.dispatch(getNewsHome(newsHomeData));
      } catch (error) {
        const err = util.inspect(error);
        return { err };
      }
    }
    return null;
  }
  state = {
    newTypeFocus: 0,
    currentPage: 1,
    hasSearched: false,
    isFetch: false,
    searchList: null,
    searchCount: null,
    typeId: null
  };
  onNewTypeClick = (id, index) => {
    this.setState(
      () => ({
        newTypeFocus: index,
        typeId: id,
        isFetch: true,
        currentPage: 1
      }),
      () => {
        const { typeId } = this.state;
        this.fetchData(typeId);
      }
    );
  };
  onPageChange = page => {
    this.setState(
      () => ({
        isFetch: true,
        currentPage: page
      }),
      () => {
        const { typeId } = this.state;
        this.fetchData(typeId);
      }
    );
  };
  fetchData = id => {
    http
      .get("information/list", { type: id })
      .then(response => {
        // 这里的判断条件根据具体的接口情况而调整
        this.setState(() => ({ isFetch: false, hasSearched: true }));
        if (response.code === 200 && response.success) {
          const searchList =
            response.data && response.data.list && response.data.list.list;
          const searchCount =
            response.data && response.data.list && response.data.list.count;
          this.setState(() => ({ searchList, searchCount }));
        } else {
          message.error(
            response.msg ? response.msg : "抱歉，请求异常，请稍后再试！"
          );
        }
      })
      .catch(err => {
        message.error("网络错误，请稍后再试！");
        console.info(err);
      });
  };
  render() {
    const { newsHome, err } = this.props;
    const {
      newTypeFocus,
      currentPage,
      hasSearched,
      isFetch,
      searchList,
      searchCount
    } = this.state;
    if (err) {
      return <ErrorFetch err={err} />;
    }
    return (
      <Layout title="资讯" style={{ backgroundColor: "#f8f8f8" }}>
        {isFetch && <LoadingFetch />}
        {/* banner */}
        <div style={{ height: "300px", backgroundColor: "#6bb0ff" }}>
          <div
            style={{ backgroundColor: "#6bb0ff" }}
            className="box h-100 loan-banner-bg"
          />
        </div>
        {/* 主体 */}
        <div className="box">
          {/* 面包屑 */}
          <div className="h70 flex ai-center plr20">
            <WrapLink href="/" as="/" className="c333 font16">
              首页
            </WrapLink>
            <Icon type="right" className="plr5" />
            <span className="c999 font16">资讯</span>
          </div>
          {/* 核心块 */}
          <div className="flex">
            {/* 左边 资讯列表 */}
            <div className="equal pr30 bg-white pt10">
              {/* 分类选项 */}
              <div className="pl30 h104 flex ai-center">
                {newsHome &&
                  newsHome.type &&
                  newsHome.type.length > 0 &&
                  newsHome.type.map((item, index) => (
                    <NewTypeLink
                      key={uuid()}
                      item={item}
                      index={index}
                      newTypeFocus={newTypeFocus}
                      onNewTypeClick={this.onNewTypeClick}
                    />
                  ))}
              </div>
              <div style={{ paddingLeft: "50px" }} className="pt20">
                {newsHome &&
                  newsHome.list &&
                  newsHome.list.list &&
                  newsHome.list.list.length > 0 &&
                  (hasSearched
                    ? searchList &&
                      searchList.length > 0 &&
                      searchList.map(item => (
                        <NewList key={uuid()} item={item} />
                      ))
                    : newsHome.list.list.map(item => (
                        <NewList key={uuid()} item={item} />
                      )))}
                {hasSearched &&
                  (!searchList || searchList.length === 0) && (
                    <div
                      className="flex jc-center font14 bold ai-center h50"
                      style={{ backgroundColor: "#f6f6f6" }}
                    >
                      orry~暂无数据。
                    </div>
                  )}
              </div>
              <div className="pb30 flex jc-center">
                <Pagination
                  hideOnSinglePage
                  className="pt30"
                  current={currentPage}
                  defaultPageSize={10}
                  total={
                    hasSearched
                      ? searchCount
                      : newsHome && newsHome.list && newsHome.list.count
                        ? newsHome.list.count
                        : 1
                  }
                  onChange={this.onPageChange}
                />
              </div>
            </div>
            {/* 右边 资讯排行 */}
            <div style={{ width: "280px" }} className="ml20">
              <div className="bg-white plr25 pb15">
                <div className="font20 bold pt25 pb15">资讯排行</div>
                {newsHome &&
                  newsHome.hot &&
                  newsHome.hot.list &&
                  newsHome.hot.list.length > 0 &&
                  newsHome.hot.list.slice(0, 9).map((item, index) => (
                    <WrapLink
                      key={uuid()}
                      href="/"
                      as="/"
                      className="font14 c333 mb10 text-overflow-one block"
                      title={item.title}
                    >
                      <span className={index < 3 ? "c-main" : "c666"}>
                        [ {index + 1} ]{" "}
                      </span>
                      {item.title}
                    </WrapLink>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: "53px" }} />
      </Layout>
    );
  }
}
