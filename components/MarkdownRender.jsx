import { memo, useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import 'github-markdown-css';
// 解决中文乱码问题
function base64ToUtf8(str) {
    return decodeURIComponent(escape(atob(str)));
}

const md = new MarkdownIt({
    html: true, //如果有图片正常显示，否则显示字符串
    linkify: true //如果有链接直接显示成链接
});

export default memo(function MarkdownRender({ content, isBase64 }) {
    const markdown = isBase64 ? base64ToUtf8(content) : content;
    const html = useMemo(() => md.render(markdown), [markdown]);
    return (
        <div className="markdown-body">
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
    );
});
