! function(t) {
    function e(i) {
        if (n[i]) return n[i].exports;
        var r = n[i] = {
            exports: {},
            id: i,
            loaded: !1
        };
        return t[i].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports
    }
    var n = {};
    return e.m = t, e.c = n, e.p = "", e(0)
}({
    0: function(t, e, n) {
        t.exports = n(86)
    },
    86: function(t, e, n) {
        n(89), n(166)
    },
    89: function(t, e) {
        function n() {
            $(".pre_war_article").css({
                "padding-top": window.innerHeight / 3 * 2,
                "padding-bottom": window.innerHeight / 3 * 1
            }), $(".pre_war_article").eq(0).css({
                "padding-top": window.innerHeight / 4
            }), $(".pre_war_article").eq(3).css({
                "padding-bottom": 0
            })
        }
        var i = {
            unfixed: 0,
            fixed: 1
        };
        $(document).ready(function() {
            function t() {
                for (var t = 0; t < c.length; t++) d[t] = parseInt(c.eq(t).offset().top)
            }

            function e() {
                var t = parseInt(l.offset().left),
                    e = parseInt(l.css("margin-top"));
                $("#pre_war_fixed_chart").css({
                    position: "fixed",
                    top: e,
                    left: t
                });
                var n = document.getElementById("pre_war_fixed_chart");
                n.style.left = t + "px", $("#pre_war_chapter_article_div").css({
                    "padding-left": f
                })
            }

            function r() {
                $("#pre_war_fixed_chart").css({
                    position: "static"
                }), $("#pre_war_chapter_article_div").css({
                    "padding-left": 0
                })
            }

            function o(t) {
                $("#pre_war_fixed_chart").css({
                    position: "absolute",
                    top: t
                }), $("#pre_war_chapter_article_div").css({
                    "padding-left": f
                })
            }

            function s(t) {
                var n = parseInt(u.offset().top) - parseInt(_.height()),
                    s = parseInt(l.css("margin-top")),
                    a = parseInt(l.offset().top) - s;
                t > a && n > t && h === i.unfixed ? (e(), h = i.fixed) : h === i.fixed && (t > n ? (o(n), h = i.unfixed) : a > t && (r(), h = i.unfixed));
                for (var p = d.length - 1; p >= 1; p--)
                    if (d[p] < t) {
                        if (v === p) return;
                        intro_popYear(chapter_list[p]), v = p;
                        break
                    }
                if (d[1] > t) {
                    if (0 === v) return;
                    return intro_popYear(chapter_list[0]), void(v = 0)
                }
            }
            var a = $(window);
            n();
            var p = $("#pre_war_chapter_article_div");
            p.css({
                "padding-bottom": window.innerHeight / 3 * 2
            });
            var f = $(".chapter_chart_div_s86").width(),
                c = $(".pre_war_article"),
                d = [];
            t();
            var l = $("#pre_war_refugee_map"),
                u = $("#pre_war_section_bottom"),
                _ = $("#pre_war_fixed_chart"),
                h = i.unfixed,
                v = 0;
            a.on("scroll", function() {
                var t = a.scrollTop();
                s(t)
            }), a.resize(function() {
                t();
                var n = a.scrollTop(),
                    i = parseInt(u.offset().top) - parseInt(_.height()),
                    s = parseInt(l.offset().top);
                n > s && i > n ? e() : n > i ? o(i) : r()
            })
        }), $(document).ready(function() {
            function t() {
                var t = parseInt(p.offset().top),
                    e = parseInt(p.css("margin-left")),
                    n = parseInt(p.css("margin-top")),
                    i = parseInt(f.css("width")),
                    r = parseInt(f.css("height"));
                $(".map_div_linegraph").css({
                    left: e + i,
                    top: t + n + r
                }), $(".map_div_article").css({
                    left: e + i,
                    top: t + n + r
                })
            }

            function e() {
                var t = parseInt(p.offset().left),
                    e = parseInt(p.css("margin-top"));
                c.css({
                    position: "fixed",
                    top: e
                }), d.css({
                    position: "fixed",
                    top: e,
                    left: t + 8
                }), l.css({
                    "padding-left": _
                })
            }

            function n() {
                c.css({
                    position: "absolute",
                    top: p.offset().top
                }), d.css({
                    position: "absolute",
                    top: p.offset().top
                })
            }

            function r(t) {
                c.css({
                    position: "absolute",
                    top: t
                }), d.css({
                    position: "absolute",
                    top: t
                })
            }

            function o(t) {
                var o = parseInt(x.offset().top) - parseInt(d.height()),
                    s = parseInt(p.offset().top);
                t > s && o > t && g === i.unfixed ? (e(), g = i.fix) : g === i.fix && (t > o ? (r(o), g = i.unfixed) : s > t && (n(), g = i.unfixed));
                for (var a = h.length - 1; a >= 1; a--)
                    if (h[a] < t) {
                        if (m === a) return;
                        mapTransition(2011 + a), pieTransition(2011 + a), total_numTransition(2011 + a), lineTransition(2011 + a), m = a;
                        break
                    }
                if (h[1] > t) {
                    if (0 === m) return;
                    return mapTransition(2011), pieTransition(2011), total_numTransition(2011), lineTransition(2011), void(m = 0)
                }
            }
            var s = $(window),
                a = $(".gdp_div_textCol");
            a.on("click", function() {
                var t = $(this);
                a.removeClass("gdp_div_textCol_click"), a.addClass("gdp_div_textCol_unclick"), t.addClass("gdp_div_textCol_click"), t.removeClass("gdp_div_textCol_unclick");
                var e = t.attr("class").split(/\s+/);
                switch (e[1]) {
                    case "gdp_year_button2011":
                        scatterTransition(2011);
                        break;
                    case "gdp_year_button2012":
                        scatterTransition(2012);
                        break;
                    case "gdp_year_button2013":
                        scatterTransition(2013);
                        break;
                    case "gdp_year_button2014":
                        scatterTransition(2014)
                }
            });
            var p = $("#refugee_map"),
                f = $(".map_div_map"),
                c = $("#fixed_graph"),
                d = $("#fixed_chart"),
                l = $("#map_div_article"),
                u = $(".chapter_article");
            t(), $(".chapter_article").css({
                "padding-top": window.innerHeight / 2,
                "padding-bottom": window.innerHeight / 2
            }), $(".chapter_article").eq(0).css({
                "padding-top": window.innerHeight / 4
            });
            for (var _ = d.width(), h = [], v = 0; v < u.length; v++) h[v] = parseInt(u.eq(v).offset().top);
            $("#map_div_article").css({
                "padding-left": _
            });
            var g = i.unfixed,
                m = 0,
                x = $("#rms_section_bottom");
            s.resize(function() {
                t();
                var i = s.scrollTop(),
                    o = parseInt(x.offset().top) - parseInt(d.height()),
                    a = parseInt(p.offset().top);
                i > a && o > i ? e() : i > o ? r(o) : n(), resize_refugeeMap()
            }), s.on("scroll", function() {
                var t = s.scrollTop();
                o(t)
            })
        }), $(document).ready(function() {
            function t() {
                $(".timeline_div_article_content").css({
                    "padding-top": window.innerHeight / 3 * 2,
                    "padding-bottom": window.innerHeight / 3 * 1
                }), $(".timeline_div_article_content").eq(0).css({
                    "padding-top": window.innerHeight / 4
                })
            }

            function e() {
                var t = parseInt(p.offset().left),
                    e = parseInt(p.css("margin-top")),
                    n = parseInt(a.css("width"));
                a.css({
                    position: "fixed",
                    top: e,
                    left: t
                }), f.css({
                    "padding-left": n,
                    width: "auto"
                })
            }

            function n() {
                a.css("position", "static"), f.css({
                    "padding-left": 0,
                    width: 420
                })
            }

            function r() {
                for (var t = 0; t < c.length && (d[t] = parseInt(c.eq(t).offset().top), 0 !== t || l !== d[t]); t++);
                l = d[0]
            }
            var o = $(window);
            t();
            var s = $("#c4"),
                a = $("#timeline_div"),
                p = $("#timeline"),
                f = $("#timeline_article");
            o.resize(function() {
                var t = o.scrollTop(),
                    i = parseInt(s.offset().top) - parseInt(a.height()),
                    r = parseInt(p.offset().top);
                if (timeline_resize(), t > r && i > t) e();
                else if (t > i) {
                    var f = parseInt(p.css("margin-left"));
                    a.css({
                        position: "absolute",
                        top: i,
                        left: f
                    })
                } else n()
            });
            var c = $(".timeline_div_article_content"),
                d = [],
                l = 0;
            r();
            var u = i.unfixed,
                _ = 0;
            o.on("scroll", function() {
                var t = o.scrollTop();
                r();
                var f = parseInt(s.offset().top) - parseInt(a.height()),
                    c = parseInt(p.offset().top) - parseInt(p.css("margin-top"));
                t > c && f > t && u === i.unfixed ? (e(), u = i.fix) : u === i.fix && (t > f ? (a.css({
                    position: "absolute",
                    top: f + parseInt(p.css("margin-top")),
                    left: parseInt(p.offset().left)
                }), u = i.unfixed) : c > t && (n(), u = i.unfixed));
                for (var l = d.length - 1; l >= 1; l--)
                    if (d[l] < t) {
                        if (_ === l + 2) return;
                        chapter_move(l + 2), _ = l + 2;
                        break
                    }
                if (d[1] > t) {
                    if (2 === _) return;
                    return chapter_move(2), void(_ = 2)
                }
            })
        })
    },
    90: function(t, e, n) {
        e = t.exports = n(91)(), e.push([t.id, ".gdp_div_textCol_unclick{opacity:.5}.gdp_div_textCol_unclick:hover{opacity:.8}.gdp_div_textCol_click{opacity:1}", ""])
    },
    91: function(t, e) {
        t.exports = function() {
            var t = [];
            return t.toString = function() {
                for (var t = [], e = 0; e < this.length; e++) {
                    var n = this[e];
                    n[2] ? t.push("@media " + n[2] + "{" + n[1] + "}") : t.push(n[1])
                }
                return t.join("")
            }, t.i = function(e, n) {
                "string" == typeof e && (e = [
                    [null, e, ""]
                ]);
                for (var i = {}, r = 0; r < this.length; r++) {
                    var o = this[r][0];
                    "number" == typeof o && (i[o] = !0)
                }
                for (r = 0; r < e.length; r++) {
                    var s = e[r];
                    "number" == typeof s[0] && i[s[0]] || (n && !s[2] ? s[2] = n : n && (s[2] = "(" + s[2] + ") and (" + n + ")"), t.push(s))
                }
            }, t
        }
    },
    165: function(t, e, n) {
        function i(t, e) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n],
                    r = u[i.id];
                if (r) {
                    r.refs++;
                    for (var o = 0; o < r.parts.length; o++) r.parts[o](i.parts[o]);
                    for (; o < i.parts.length; o++) r.parts.push(f(i.parts[o], e))
                } else {
                    for (var s = [], o = 0; o < i.parts.length; o++) s.push(f(i.parts[o], e));
                    u[i.id] = {
                        id: i.id,
                        refs: 1,
                        parts: s
                    }
                }
            }
        }

        function r(t) {
            for (var e = [], n = {}, i = 0; i < t.length; i++) {
                var r = t[i],
                    o = r[0],
                    s = r[1],
                    a = r[2],
                    p = r[3],
                    f = {
                        css: s,
                        media: a,
                        sourceMap: p
                    };
                n[o] ? n[o].parts.push(f) : e.push(n[o] = {
                    id: o,
                    parts: [f]
                })
            }
            return e
        }

        function o(t, e) {
            var n = v(),
                i = x[x.length - 1];
            if ("top" === t.insertAt) i ? i.nextSibling ? n.insertBefore(e, i.nextSibling) : n.appendChild(e) : n.insertBefore(e, n.firstChild), x.push(e);
            else {
                if ("bottom" !== t.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
                n.appendChild(e)
            }
        }

        function s(t) {
            t.parentNode.removeChild(t);
            var e = x.indexOf(t);
            e >= 0 && x.splice(e, 1)
        }

        function a(t) {
            var e = document.createElement("style");
            return e.type = "text/css", o(t, e), e
        }

        function p(t) {
            var e = document.createElement("link");
            return e.rel = "stylesheet", o(t, e), e
        }

        function f(t, e) {
            var n, i, r;
            if (e.singleton) {
                var o = m++;
                n = g || (g = a(e)), i = c.bind(null, n, o, !1), r = c.bind(null, n, o, !0)
            } else t.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (n = p(e), i = l.bind(null, n), r = function() {
                s(n), n.href && URL.revokeObjectURL(n.href)
            }) : (n = a(e), i = d.bind(null, n), r = function() {
                s(n)
            });
            return i(t),
                function(e) {
                    if (e) {
                        if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap) return;
                        i(t = e)
                    } else r()
                }
        }

        function c(t, e, n, i) {
            var r = n ? "" : i.css;
            if (t.styleSheet) t.styleSheet.cssText = w(e, r);
            else {
                var o = document.createTextNode(r),
                    s = t.childNodes;
                s[e] && t.removeChild(s[e]), s.length ? t.insertBefore(o, s[e]) : t.appendChild(o)
            }
        }

        function d(t, e) {
            var n = e.css,
                i = e.media;
            if (i && t.setAttribute("media", i), t.styleSheet) t.styleSheet.cssText = n;
            else {
                for (; t.firstChild;) t.removeChild(t.firstChild);
                t.appendChild(document.createTextNode(n))
            }
        }

        function l(t, e) {
            var n = e.css,
                i = e.sourceMap;
            i && (n += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(i)))) + " */");
            var r = new Blob([n], {
                    type: "text/css"
                }),
                o = t.href;
            t.href = URL.createObjectURL(r), o && URL.revokeObjectURL(o)
        }
        var u = {},
            _ = function(t) {
                var e;
                return function() {
                    return "undefined" == typeof e && (e = t.apply(this, arguments)), e
                }
            },
            h = _(function() {
                return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())
            }),
            v = _(function() {
                return document.head || document.getElementsByTagName("head")[0]
            }),
            g = null,
            m = 0,
            x = [];
        t.exports = function(t, e) {
            e = e || {}, "undefined" == typeof e.singleton && (e.singleton = h()), "undefined" == typeof e.insertAt && (e.insertAt = "bottom");
            var n = r(t);
            return i(n, e),
                function(t) {
                    for (var o = [], s = 0; s < n.length; s++) {
                        var a = n[s],
                            p = u[a.id];
                        p.refs--, o.push(p)
                    }
                    if (t) {
                        var f = r(t);
                        i(f, e)
                    }
                    for (var s = 0; s < o.length; s++) {
                        var p = o[s];
                        if (0 === p.refs) {
                            for (var c = 0; c < p.parts.length; c++) p.parts[c]();
                            delete u[p.id]
                        }
                    }
                }
        };
        var w = function() {
            var t = [];
            return function(e, n) {
                return t[e] = n, t.filter(Boolean).join("\n")
            }
        }()
    },
    166: function(t, e, n) {
        var i = n(90);
        "string" == typeof i && (i = [
            [t.id, i, ""]
        ]), n(165)(i, {}), i.locals && (t.exports = i.locals)
    }
});