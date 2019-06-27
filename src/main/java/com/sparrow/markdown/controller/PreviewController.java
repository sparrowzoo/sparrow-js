package com.sparrow.markdown.controller;

import com.sparrow.markdown.vo.MarkdownVO;
import com.sparrow.mvc.RequestParameters;

public class PreviewController {
    @RequestParameters("markdown")
    public MarkdownVO preview(String markdown){
        return new MarkdownVO(markdown+"html");
    }
}
