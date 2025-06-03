/**
 * Browser Image Compression
 * v2.0.0
 * by Donald <donaldcwl@gmail.com>
 * https://github.com/Donaldcwl/browser-image-compression
 */
!(function (e, r) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = r())
    : "function" == typeof define && define.amd
    ? define(r)
    : ((e =
        "undefined" != typeof globalThis
          ? globalThis
          : e || self).imageCompression = r());
})(this, function () {
  "use strict";
  function _mergeNamespaces(e, r) {
    return (
      r.forEach(function (r) {
        Object.keys(r).forEach(function (t) {
          if ("default" !== t && !(t in e)) {
            var a = Object.getOwnPropertyDescriptor(r, t);
            Object.defineProperty(
              e,
              t,
              a.get
                ? a
                : {
                    enumerable: !0,
                    get: function () {
                      return r[t];
                    },
                  }
            );
          }
        });
      }),
      Object.freeze(e)
    );
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var a = Object.getOwnPropertySymbols(e);
      r &&
        (a = a.filter(function (r) {
          return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })),
        t.push.apply(t, a);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2
        ? ownKeys(Object(t), !0).forEach(function (r) {
            _defineProperty(e, r, t[r]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
        : ownKeys(Object(t)).forEach(function (r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
          });
    }
    return e;
  }
  function _defineProperty(e, r, t) {
    return (
      r in e
        ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[r] = t),
      e
    );
  }
  function _slicedToArray(e, r) {
    return (
      _arrayWithHoles(e) ||
      _iterableToArrayLimit(e, r) ||
      _unsupportedIterableToArray(e, r) ||
      _nonIterableRest()
    );
  }
  function _arrayWithHoles(e) {
    if (Array.isArray(e)) return e;
  }
  function _iterableToArrayLimit(e, r) {
    var t =
      null == e
        ? null
        : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
          e["@@iterator"];
    if (null != t) {
      var a,
        i,
        s = [],
        f = !0,
        c = !1;
      try {
        for (
          t = t.call(e);
          !(f = (a = t.next()).done) && (s.push(a.value), !r || s.length !== r);
          f = !0
        );
      } catch (e) {
        (c = !0), (i = e);
      } finally {
        try {
          f || null == t.return || t.return();
        } finally {
          if (c) throw i;
        }
      }
      return s;
    }
  }
  function _unsupportedIterableToArray(e, r) {
    if (e) {
      if ("string" == typeof e) return _arrayLikeToArray(e, r);
      var t = Object.prototype.toString.call(e).slice(8, -1);
      return (
        "Object" === t && e.constructor && (t = e.constructor.name),
        "Map" === t || "Set" === t
          ? Array.from(e)
          : "Arguments" === t ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
          ? _arrayLikeToArray(e, r)
          : void 0
      );
    }
  }
  function _arrayLikeToArray(e, r) {
    (null == r || r > e.length) && (r = e.length);
    for (var t = 0, a = new Array(r); t < r; t++) a[t] = e[t];
    return a;
  }
  function _nonIterableRest() {
    throw new TypeError(
      "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  function createCommonjsModule(e) {
    var r = { exports: {} };
    return e(r, r.exports), r.exports;
  }
  var UZIP_1 = createCommonjsModule(function (e) {
      var r,
        t,
        UZIP = {};
      (e.exports = UZIP),
        (UZIP.parse = function (e, r) {
          for (
            var t = UZIP.bin.readUshort,
              a = UZIP.bin.readUint,
              i = 0,
              s = {},
              f = new Uint8Array(e),
              c = f.length - 4;
            101010256 != a(f, c);

          )
            c--;
          i = c;
          i += 4;
          var l = t(f, (i += 4));
          t(f, (i += 2));
          var u = a(f, (i += 2)),
            d = a(f, (i += 4));
          (i += 4), (i = d);
          for (var h = 0; h < l; h++) {
            a(f, i), (i += 4), (i += 4), (i += 4), a(f, (i += 4));
            u = a(f, (i += 4));
            var A = a(f, (i += 4)),
              v = t(f, (i += 4)),
              p = t(f, i + 2),
              m = t(f, i + 4);
            i += 6;
            var g = a(f, (i += 8));
            (i += 4), (i += v + p + m), UZIP._readLocal(f, g, s, u, A, r);
          }
          return s;
        }),
        (UZIP._readLocal = function (e, r, t, a, i, s) {
          var f = UZIP.bin.readUshort,
            c = UZIP.bin.readUint;
          c(e, r), f(e, (r += 4)), f(e, (r += 2));
          var l = f(e, (r += 2));
          c(e, (r += 2)), c(e, (r += 4)), (r += 4);
          var u = f(e, (r += 8)),
            d = f(e, (r += 2));
          r += 2;
          var h = UZIP.bin.readUTF8(e, r, u);
          if (((r += u), (r += d), s)) t[h] = { size: i, csize: a };
          else {
            var A = new Uint8Array(e.buffer, r);
            if (0 == l) t[h] = new Uint8Array(A.buffer.slice(r, r + a));
            else {
              if (8 != l) throw "unknown compression method: " + l;
              var v = new Uint8Array(i);
              UZIP.inflateRaw(A, v), (t[h] = v);
            }
          }
        }),
        (UZIP.inflateRaw = function (e, r) {
          return UZIP.F.inflate(e, r);
        }),
        (UZIP.inflate = function (e, r) {
          return (
            e[0],
            e[1],
            UZIP.inflateRaw(
              new Uint8Array(e.buffer, e.byteOffset + 2, e.length - 6),
              r
            )
          );
        }),
        (UZIP.deflate = function (e, r) {
          null == r && (r = { level: 6 });
          var t = 0,
            a = new Uint8Array(50 + Math.floor(1.1 * e.length));
          (a[t] = 120),
            (a[t + 1] = 156),
            (t += 2),
            (t = UZIP.F.deflateRaw(e, a, t, r.level));
          var i = UZIP.adler(e, 0, e.length);
          return (
            (a[t + 0] = (i >>> 24) & 255),
            (a[t + 1] = (i >>> 16) & 255),
            (a[t + 2] = (i >>> 8) & 255),
            (a[t + 3] = (i >>> 0) & 255),
            new Uint8Array(a.buffer, 0, t + 4)
          );
        }),
        (UZIP.deflateRaw = function (e, r) {
          null == r && (r = { level: 6 });
          var t = new Uint8Array(50 + Math.floor(1.1 * e.length)),
            a = UZIP.F.deflateRaw(e, t, a, r.level);
          return new Uint8Array(t.buffer, 0, a);
        }),
        (UZIP.encode = function (e, r) {
          null == r && (r = !1);
          var t = 0,
            a = UZIP.bin.writeUint,
            i = UZIP.bin.writeUshort,
            s = {};
          for (var f in e) {
            var c = !UZIP._noNeed(f) && !r,
              l = e[f],
              u = UZIP.crc.crc(l, 0, l.length);
            s[f] = {
              cpr: c,
              usize: l.length,
              crc: u,
              file: c ? UZIP.deflateRaw(l) : l,
            };
          }
          for (var f in s)
            t += s[f].file.length + 30 + 46 + 2 * UZIP.bin.sizeUTF8(f);
          t += 22;
          var d = new Uint8Array(t),
            h = 0,
            A = [];
          for (var f in s) {
            var v = s[f];
            A.push(h), (h = UZIP._writeHeader(d, h, f, v, 0));
          }
          var p = 0,
            m = h;
          for (var f in s) {
            v = s[f];
            A.push(h), (h = UZIP._writeHeader(d, h, f, v, 1, A[p++]));
          }
          var g = h - m;
          return (
            a(d, h, 101010256),
            (h += 4),
            i(d, (h += 4), p),
            i(d, (h += 2), p),
            a(d, (h += 2), g),
            a(d, (h += 4), m),
            (h += 4),
            (h += 2),
            d.buffer
          );
        }),
        (UZIP._noNeed = function (e) {
          var r = e.split(".").pop().toLowerCase();
          return -1 != "png,jpg,jpeg,zip".indexOf(r);
        }),
        (UZIP._writeHeader = function (e, r, t, a, i, s) {
          var f = UZIP.bin.writeUint,
            c = UZIP.bin.writeUshort,
            l = a.file;
          return (
            f(e, r, 0 == i ? 67324752 : 33639248),
            (r += 4),
            1 == i && (r += 2),
            c(e, r, 20),
            c(e, (r += 2), 0),
            c(e, (r += 2), a.cpr ? 8 : 0),
            f(e, (r += 2), 0),
            f(e, (r += 4), a.crc),
            f(e, (r += 4), l.length),
            f(e, (r += 4), a.usize),
            c(e, (r += 4), UZIP.bin.sizeUTF8(t)),
            c(e, (r += 2), 0),
            (r += 2),
            1 == i && ((r += 2), (r += 2), f(e, (r += 6), s), (r += 4)),
            (r += UZIP.bin.writeUTF8(e, r, t)),
            0 == i && (e.set(l, r), (r += l.length)),
            r
          );
        }),
        (UZIP.crc = {
          table: (function () {
            for (var e = new Uint32Array(256), r = 0; r < 256; r++) {
              for (var t = r, a = 0; a < 8; a++)
                1 & t ? (t = 3988292384 ^ (t >>> 1)) : (t >>>= 1);
              e[r] = t;
            }
            return e;
          })(),
          update: function (e, r, t, a) {
            for (var i = 0; i < a; i++)
              e = UZIP.crc.table[255 & (e ^ r[t + i])] ^ (e >>> 8);
            return e;
          },
          crc: function (e, r, t) {
            return 4294967295 ^ UZIP.crc.update(4294967295, e, r, t);
          },
        }),
        (UZIP.adler = function (e, r, t) {
          for (var a = 1, i = 0, s = r, f = r + t; s < f; ) {
            for (var c = Math.min(s + 5552, f); s < c; ) i += a += e[s++];
            (a %= 65521), (i %= 65521);
          }
          return (i << 16) | a;
        }),
        (UZIP.bin = {
          readUshort: function (e, r) {
            return e[r] | (e[r + 1] << 8);
          },
          writeUshort: function (e, r, t) {
            (e[r] = 255 & t), (e[r + 1] = (t >> 8) & 255);
          },
          readUint: function (e, r) {
            return (
              16777216 * e[r + 3] + ((e[r + 2] << 16) | (e[r + 1] << 8) | e[r])
            );
          },
          writeUint: function (e, r, t) {
            (e[r] = 255 & t),
              (e[r + 1] = (t >> 8) & 255),
              (e[r + 2] = (t >> 16) & 255),
              (e[r + 3] = (t >> 24) & 255);
          },
          readASCII: function (e, r, t) {
            for (var a = "", i = 0; i < t; i++)
              a += String.fromCharCode(e[r + i]);
            return a;
          },
          writeASCII: function (e, r, t) {
            for (var a = 0; a < t.length; a++) e[r + a] = t.charCodeAt(a);
          },
          pad: function (e) {
            return e.length < 2 ? "0" + e : e;
          },
          readUTF8: function (e, r, t) {
            for (var a, i = "", s = 0; s < t; s++)
              i += "%" + UZIP.bin.pad(e[r + s].toString(16));
            try {
              a = decodeURIComponent(i);
            } catch (a) {
              return UZIP.bin.readASCII(e, r, t);
            }
            return a;
          },
          writeUTF8: function (e, r, t) {
            for (var a = t.length, i = 0, s = 0; s < a; s++) {
              var f = t.charCodeAt(s);
              if (0 == (4294967168 & f)) (e[r + i] = f), i++;
              else if (0 == (4294965248 & f))
                (e[r + i] = 192 | (f >> 6)),
                  (e[r + i + 1] = 128 | ((f >> 0) & 63)),
                  (i += 2);
              else if (0 == (4294901760 & f))
                (e[r + i] = 224 | (f >> 12)),
                  (e[r + i + 1] = 128 | ((f >> 6) & 63)),
                  (e[r + i + 2] = 128 | ((f >> 0) & 63)),
                  (i += 3);
              else {
                if (0 != (4292870144 & f)) throw "e";
                (e[r + i] = 240 | (f >> 18)),
                  (e[r + i + 1] = 128 | ((f >> 12) & 63)),
                  (e[r + i + 2] = 128 | ((f >> 6) & 63)),
                  (e[r + i + 3] = 128 | ((f >> 0) & 63)),
                  (i += 4);
              }
            }
            return i;
          },
          sizeUTF8: function (e) {
            for (var r = e.length, t = 0, a = 0; a < r; a++) {
              var i = e.charCodeAt(a);
              if (0 == (4294967168 & i)) t++;
              else if (0 == (4294965248 & i)) t += 2;
              else if (0 == (4294901760 & i)) t += 3;
              else {
                if (0 != (4292870144 & i)) throw "e";
                t += 4;
              }
            }
            return t;
          },
        }),
        (UZIP.F = {}),
        (UZIP.F.deflateRaw = function (e, r, t, a) {
          var i = [
              [0, 0, 0, 0, 0],
              [4, 4, 8, 4, 0],
              [4, 5, 16, 8, 0],
              [4, 6, 16, 16, 0],
              [4, 10, 16, 32, 0],
              [8, 16, 32, 32, 0],
              [8, 16, 128, 128, 0],
              [8, 32, 128, 256, 0],
              [32, 128, 258, 1024, 1],
              [32, 258, 258, 4096, 1],
            ][a],
            s = UZIP.F.U,
            f = UZIP.F._goodIndex;
          UZIP.F._hash;
          var c = UZIP.F._putsE,
            l = 0,
            u = t << 3,
            d = 0,
            h = e.length;
          if (0 == a) {
            for (; l < h; ) {
              c(r, u, l + (I = Math.min(65535, h - l)) == h ? 1 : 0),
                (u = UZIP.F._copyExact(e, l, I, r, u + 8)),
                (l += I);
            }
            return u >>> 3;
          }
          var A = s.lits,
            v = s.strt,
            p = s.prev,
            m = 0,
            g = 0,
            U = 0,
            w = 0,
            _ = 0,
            P = 0;
          for (h > 2 && (v[(P = UZIP.F._hash(e, 0))] = 0), l = 0; l < h; l++) {
            if (((_ = P), l + 1 < h - 2)) {
              P = UZIP.F._hash(e, l + 1);
              var b = (l + 1) & 32767;
              (p[b] = v[P]), (v[P] = b);
            }
            if (d <= l) {
              (m > 14e3 || g > 26697) &&
                h - l > 100 &&
                (d < l && ((A[m] = l - d), (m += 2), (d = l)),
                (u = UZIP.F._writeBlock(
                  l == h - 1 || d == h ? 1 : 0,
                  A,
                  m,
                  w,
                  e,
                  U,
                  l - U,
                  r,
                  u
                )),
                (m = g = w = 0),
                (U = l));
              var y = 0;
              l < h - 2 &&
                (y = UZIP.F._bestMatch(
                  e,
                  l,
                  p,
                  _,
                  Math.min(i[2], h - l),
                  i[3]
                ));
              var I = y >>> 16,
                F = 65535 & y;
              if (0 != y) {
                F = 65535 & y;
                var E = f((I = y >>> 16), s.of0);
                s.lhst[257 + E]++;
                var C = f(F, s.df0);
                s.dhst[C]++,
                  (w += s.exb[E] + s.dxb[C]),
                  (A[m] = (I << 23) | (l - d)),
                  (A[m + 1] = (F << 16) | (E << 8) | C),
                  (m += 2),
                  (d = l + I);
              } else s.lhst[e[l]]++;
              g++;
            }
          }
          for (
            (U == l && 0 != e.length) ||
            (d < l && ((A[m] = l - d), (m += 2), (d = l)),
            (u = UZIP.F._writeBlock(1, A, m, w, e, U, l - U, r, u)),
            (m = 0),
            (g = 0),
            (m = g = w = 0),
            (U = l));
            0 != (7 & u);

          )
            u++;
          return u >>> 3;
        }),
        (UZIP.F._bestMatch = function (e, r, t, a, i, s) {
          var f = 32767 & r,
            c = t[f],
            l = (f - c + 32768) & 32767;
          if (c == f || a != UZIP.F._hash(e, r - l)) return 0;
          for (
            var u = 0, d = 0, h = Math.min(32767, r);
            l <= h && 0 != --s && c != f;

          ) {
            if (0 == u || e[r + u] == e[r + u - l]) {
              var A = UZIP.F._howLong(e, r, l);
              if (A > u) {
                if (((d = l), (u = A) >= i)) break;
                l + 2 < A && (A = l + 2);
                for (var v = 0, p = 0; p < A - 2; p++) {
                  var m = (r - l + p + 32768) & 32767,
                    g = (m - t[m] + 32768) & 32767;
                  g > v && ((v = g), (c = m));
                }
              }
            }
            l += ((f = c) - (c = t[f]) + 32768) & 32767;
          }
          return (u << 16) | d;
        }),
        (UZIP.F._howLong = function (e, r, t) {
          if (
            e[r] != e[r - t] ||
            e[r + 1] != e[r + 1 - t] ||
            e[r + 2] != e[r + 2 - t]
          )
            return 0;
          var a = r,
            i = Math.min(e.length, r + 258);
          for (r += 3; r < i && e[r] == e[r - t]; ) r++;
          return r - a;
        }),
        (UZIP.F._hash = function (e, r) {
          return (((e[r] << 8) | e[r + 1]) + (e[r + 2] << 4)) & 65535;
        }),
        (UZIP.saved = 0),
        (UZIP.F._writeBlock = function (e, r, t, a, i, s, f, c, l) {
          var u,
            d,
            h,
            A,
            v,
            p,
            m,
            g,
            U,
            w = UZIP.F.U,
            _ = UZIP.F._putsF,
            P = UZIP.F._putsE;
          w.lhst[256]++,
            (d = (u = UZIP.F.getTrees())[0]),
            (h = u[1]),
            (A = u[2]),
            (v = u[3]),
            (p = u[4]),
            (m = u[5]),
            (g = u[6]),
            (U = u[7]);
          var b = 32 + (0 == ((l + 3) & 7) ? 0 : 8 - ((l + 3) & 7)) + (f << 3),
            y =
              a +
              UZIP.F.contSize(w.fltree, w.lhst) +
              UZIP.F.contSize(w.fdtree, w.dhst),
            I =
              a +
              UZIP.F.contSize(w.ltree, w.lhst) +
              UZIP.F.contSize(w.dtree, w.dhst);
          I +=
            14 +
            3 * m +
            UZIP.F.contSize(w.itree, w.ihst) +
            (2 * w.ihst[16] + 3 * w.ihst[17] + 7 * w.ihst[18]);
          for (var F = 0; F < 286; F++) w.lhst[F] = 0;
          for (F = 0; F < 30; F++) w.dhst[F] = 0;
          for (F = 0; F < 19; F++) w.ihst[F] = 0;
          var E = b < y && b < I ? 0 : y < I ? 1 : 2;
          if ((_(c, l, e), _(c, l + 1, E), (l += 3), 0 == E)) {
            for (; 0 != (7 & l); ) l++;
            l = UZIP.F._copyExact(i, s, f, c, l);
          } else {
            var C, B;
            if ((1 == E && ((C = w.fltree), (B = w.fdtree)), 2 == E)) {
              UZIP.F.makeCodes(w.ltree, d),
                UZIP.F.revCodes(w.ltree, d),
                UZIP.F.makeCodes(w.dtree, h),
                UZIP.F.revCodes(w.dtree, h),
                UZIP.F.makeCodes(w.itree, A),
                UZIP.F.revCodes(w.itree, A),
                (C = w.ltree),
                (B = w.dtree),
                P(c, l, v - 257),
                P(c, (l += 5), p - 1),
                P(c, (l += 5), m - 4),
                (l += 4);
              for (var R = 0; R < m; R++)
                P(c, l + 3 * R, w.itree[1 + (w.ordr[R] << 1)]);
              (l += 3 * m),
                (l = UZIP.F._codeTiny(g, w.itree, c, l)),
                (l = UZIP.F._codeTiny(U, w.itree, c, l));
            }
            for (var G = s, M = 0; M < t; M += 2) {
              for (var O = r[M], x = O >>> 23, S = G + (8388607 & O); G < S; )
                l = UZIP.F._writeLit(i[G++], C, c, l);
              if (0 != x) {
                var Z = r[M + 1],
                  T = Z >> 16,
                  Q = (Z >> 8) & 255,
                  D = 255 & Z;
                P(c, (l = UZIP.F._writeLit(257 + Q, C, c, l)), x - w.of0[Q]),
                  (l += w.exb[Q]),
                  _(c, (l = UZIP.F._writeLit(D, B, c, l)), T - w.df0[D]),
                  (l += w.dxb[D]),
                  (G += x);
              }
            }
            l = UZIP.F._writeLit(256, C, c, l);
          }
          return l;
        }),
        (UZIP.F._copyExact = function (e, r, t, a, i) {
          var s = i >>> 3;
          return (
            (a[s] = t),
            (a[s + 1] = t >>> 8),
            (a[s + 2] = 255 - a[s]),
            (a[s + 3] = 255 - a[s + 1]),
            (s += 4),
            a.set(new Uint8Array(e.buffer, r, t), s),
            i + ((t + 4) << 3)
          );
        }),
        (UZIP.F.getTrees = function () {
          for (
            var e = UZIP.F.U,
              r = UZIP.F._hufTree(e.lhst, e.ltree, 15),
              t = UZIP.F._hufTree(e.dhst, e.dtree, 15),
              a = [],
              i = UZIP.F._lenCodes(e.ltree, a),
              s = [],
              f = UZIP.F._lenCodes(e.dtree, s),
              c = 0;
            c < a.length;
            c += 2
          )
            e.ihst[a[c]]++;
          for (c = 0; c < s.length; c += 2) e.ihst[s[c]]++;
          for (
            var l = UZIP.F._hufTree(e.ihst, e.itree, 7), u = 19;
            u > 4 && 0 == e.itree[1 + (e.ordr[u - 1] << 1)];

          )
            u--;
          return [r, t, l, i, f, u, a, s];
        }),
        (UZIP.F.getSecond = function (e) {
          for (var r = [], t = 0; t < e.length; t += 2) r.push(e[t + 1]);
          return r;
        }),
        (UZIP.F.nonZero = function (e) {
          for (var r = "", t = 0; t < e.length; t += 2)
            0 != e[t + 1] && (r += (t >> 1) + ",");
          return r;
        }),
        (UZIP.F.contSize = function (e, r) {
          for (var t = 0, a = 0; a < r.length; a++) t += r[a] * e[1 + (a << 1)];
          return t;
        }),
        (UZIP.F._codeTiny = function (e, r, t, a) {
          for (var i = 0; i < e.length; i += 2) {
            var s = e[i],
              f = e[i + 1];
            a = UZIP.F._writeLit(s, r, t, a);
            var c = 16 == s ? 2 : 17 == s ? 3 : 7;
            s > 15 && (UZIP.F._putsE(t, a, f, c), (a += c));
          }
          return a;
        }),
        (UZIP.F._lenCodes = function (e, r) {
          for (var t = e.length; 2 != t && 0 == e[t - 1]; ) t -= 2;
          for (var a = 0; a < t; a += 2) {
            var i = e[a + 1],
              s = a + 3 < t ? e[a + 3] : -1,
              f = a + 5 < t ? e[a + 5] : -1,
              c = 0 == a ? -1 : e[a - 1];
            if (0 == i && s == i && f == i) {
              for (var l = a + 5; l + 2 < t && e[l + 2] == i; ) l += 2;
              (u = Math.min((l + 1 - a) >>> 1, 138)) < 11
                ? r.push(17, u - 3)
                : r.push(18, u - 11),
                (a += 2 * u - 2);
            } else if (i == c && s == i && f == i) {
              for (l = a + 5; l + 2 < t && e[l + 2] == i; ) l += 2;
              var u = Math.min((l + 1 - a) >>> 1, 6);
              r.push(16, u - 3), (a += 2 * u - 2);
            } else r.push(i, 0);
          }
          return t >>> 1;
        }),
        (UZIP.F._hufTree = function (e, r, t) {
          var a = [],
            i = e.length,
            s = r.length,
            f = 0;
          for (f = 0; f < s; f += 2) (r[f] = 0), (r[f + 1] = 0);
          for (f = 0; f < i; f++) 0 != e[f] && a.push({ lit: f, f: e[f] });
          var c = a.length,
            l = a.slice(0);
          if (0 == c) return 0;
          if (1 == c) {
            var u = a[0].lit;
            l = 0 == u ? 1 : 0;
            return (r[1 + (u << 1)] = 1), (r[1 + (l << 1)] = 1), 1;
          }
          a.sort(function (e, r) {
            return e.f - r.f;
          });
          var d = a[0],
            h = a[1],
            A = 0,
            v = 1,
            p = 2;
          for (a[0] = { lit: -1, f: d.f + h.f, l: d, r: h, d: 0 }; v != c - 1; )
            (d = A != v && (p == c || a[A].f < a[p].f) ? a[A++] : a[p++]),
              (h = A != v && (p == c || a[A].f < a[p].f) ? a[A++] : a[p++]),
              (a[v++] = { lit: -1, f: d.f + h.f, l: d, r: h });
          var m = UZIP.F.setDepth(a[v - 1], 0);
          for (
            m > t && (UZIP.F.restrictDepth(l, t, m), (m = t)), f = 0;
            f < c;
            f++
          )
            r[1 + (l[f].lit << 1)] = l[f].d;
          return m;
        }),
        (UZIP.F.setDepth = function (e, r) {
          return -1 != e.lit
            ? ((e.d = r), r)
            : Math.max(
                UZIP.F.setDepth(e.l, r + 1),
                UZIP.F.setDepth(e.r, r + 1)
              );
        }),
        (UZIP.F.restrictDepth = function (e, r, t) {
          var a = 0,
            i = 1 << (t - r),
            s = 0;
          for (
            e.sort(function (e, r) {
              return r.d == e.d ? e.f - r.f : r.d - e.d;
            }),
              a = 0;
            a < e.length && e[a].d > r;
            a++
          ) {
            var f = e[a].d;
            (e[a].d = r), (s += i - (1 << (t - f)));
          }
          for (s >>>= t - r; s > 0; ) {
            (f = e[a].d) < r ? (e[a].d++, (s -= 1 << (r - f - 1))) : a++;
          }
          for (; a >= 0; a--) e[a].d == r && s < 0 && (e[a].d--, s++);
          0 != s && console.log("debt left");
        }),
        (UZIP.F._goodIndex = function (e, r) {
          var t = 0;
          return (
            r[16 | t] <= e && (t |= 16),
            r[8 | t] <= e && (t |= 8),
            r[4 | t] <= e && (t |= 4),
            r[2 | t] <= e && (t |= 2),
            r[1 | t] <= e && (t |= 1),
            t
          );
        }),
        (UZIP.F._writeLit = function (e, r, t, a) {
          return UZIP.F._putsF(t, a, r[e << 1]), a + r[1 + (e << 1)];
        }),
        (UZIP.F.inflate = function (e, r) {
          var t = Uint8Array;
          if (3 == e[0] && 0 == e[1]) return r || new t(0);
          var a = UZIP.F,
            i = a._bitsF,
            s = a._bitsE,
            f = a._decodeTiny,
            c = a.makeCodes,
            l = a.codes2map,
            u = a._get17,
            d = a.U,
            h = null == r;
          h && (r = new t((e.length >>> 2) << 3));
          for (
            var A,
              v,
              p = 0,
              m = 0,
              g = 0,
              U = 0,
              w = 0,
              _ = 0,
              P = 0,
              b = 0,
              y = 0;
            0 == p;

          )
            if (((p = i(e, y, 1)), (m = i(e, y + 1, 2)), (y += 3), 0 != m)) {
              if (
                (h && (r = UZIP.F._check(r, b + (1 << 17))),
                1 == m && ((A = d.flmap), (v = d.fdmap), (_ = 511), (P = 31)),
                2 == m)
              ) {
                (g = s(e, y, 5) + 257),
                  (U = s(e, y + 5, 5) + 1),
                  (w = s(e, y + 10, 4) + 4),
                  (y += 14);
                for (var I = 0; I < 38; I += 2)
                  (d.itree[I] = 0), (d.itree[I + 1] = 0);
                var F = 1;
                for (I = 0; I < w; I++) {
                  var E = s(e, y + 3 * I, 3);
                  (d.itree[1 + (d.ordr[I] << 1)] = E), E > F && (F = E);
                }
                (y += 3 * w),
                  c(d.itree, F),
                  l(d.itree, F, d.imap),
                  (A = d.lmap),
                  (v = d.dmap),
                  (y = f(d.imap, (1 << F) - 1, g + U, e, y, d.ttree));
                var C = a._copyOut(d.ttree, 0, g, d.ltree);
                _ = (1 << C) - 1;
                var B = a._copyOut(d.ttree, g, U, d.dtree);
                (P = (1 << B) - 1),
                  c(d.ltree, C),
                  l(d.ltree, C, A),
                  c(d.dtree, B),
                  l(d.dtree, B, v);
              }
              for (;;) {
                var R = A[u(e, y) & _];
                y += 15 & R;
                var G = R >>> 4;
                if (G >>> 8 == 0) r[b++] = G;
                else {
                  if (256 == G) break;
                  var M = b + G - 254;
                  if (G > 264) {
                    var O = d.ldef[G - 257];
                    (M = b + (O >>> 3) + s(e, y, 7 & O)), (y += 7 & O);
                  }
                  var x = v[u(e, y) & P];
                  y += 15 & x;
                  var S = x >>> 4,
                    Z = d.ddef[S],
                    T = (Z >>> 4) + i(e, y, 15 & Z);
                  for (
                    y += 15 & Z, h && (r = UZIP.F._check(r, b + (1 << 17)));
                    b < M;

                  )
                    (r[b] = r[b++ - T]),
                      (r[b] = r[b++ - T]),
                      (r[b] = r[b++ - T]),
                      (r[b] = r[b++ - T]);
                  b = M;
                }
              }
            } else {
              0 != (7 & y) && (y += 8 - (7 & y));
              var Q = 4 + (y >>> 3),
                D = e[Q - 4] | (e[Q - 3] << 8);
              h && (r = UZIP.F._check(r, b + D)),
                r.set(new t(e.buffer, e.byteOffset + Q, D), b),
                (y = (Q + D) << 3),
                (b += D);
            }
          return r.length == b ? r : r.slice(0, b);
        }),
        (UZIP.F._check = function (e, r) {
          var t = e.length;
          if (r <= t) return e;
          var a = new Uint8Array(Math.max(t << 1, r));
          return a.set(e, 0), a;
        }),
        (UZIP.F._decodeTiny = function (e, r, t, a, i, s) {
          for (var f = UZIP.F._bitsE, c = UZIP.F._get17, l = 0; l < t; ) {
            var u = e[c(a, i) & r];
            i += 15 & u;
            var d = u >>> 4;
            if (d <= 15) (s[l] = d), l++;
            else {
              var h = 0,
                A = 0;
              16 == d
                ? ((A = 3 + f(a, i, 2)), (i += 2), (h = s[l - 1]))
                : 17 == d
                ? ((A = 3 + f(a, i, 3)), (i += 3))
                : 18 == d && ((A = 11 + f(a, i, 7)), (i += 7));
              for (var v = l + A; l < v; ) (s[l] = h), l++;
            }
          }
          return i;
        }),
        (UZIP.F._copyOut = function (e, r, t, a) {
          for (var i = 0, s = 0, f = a.length >>> 1; s < t; ) {
            var c = e[s + r];
            (a[s << 1] = 0), (a[1 + (s << 1)] = c), c > i && (i = c), s++;
          }
          for (; s < f; ) (a[s << 1] = 0), (a[1 + (s << 1)] = 0), s++;
          return i;
        }),
        (UZIP.F.makeCodes = function (e, r) {
          for (
            var t, a, i, s, f = UZIP.F.U, c = e.length, l = f.bl_count, u = 0;
            u <= r;
            u++
          )
            l[u] = 0;
          for (u = 1; u < c; u += 2) l[e[u]]++;
          var d = f.next_code;
          for (t = 0, l[0] = 0, a = 1; a <= r; a++)
            (t = (t + l[a - 1]) << 1), (d[a] = t);
          for (i = 0; i < c; i += 2)
            0 != (s = e[i + 1]) && ((e[i] = d[s]), d[s]++);
        }),
        (UZIP.F.codes2map = function (e, r, t) {
          for (var a = e.length, i = UZIP.F.U.rev15, s = 0; s < a; s += 2)
            if (0 != e[s + 1])
              for (
                var f = s >> 1,
                  c = e[s + 1],
                  l = (f << 4) | c,
                  u = r - c,
                  d = e[s] << u,
                  h = d + (1 << u);
                d != h;

              ) {
                (t[i[d] >>> (15 - r)] = l), d++;
              }
        }),
        (UZIP.F.revCodes = function (e, r) {
          for (
            var t = UZIP.F.U.rev15, a = 15 - r, i = 0;
            i < e.length;
            i += 2
          ) {
            var s = e[i] << (r - e[i + 1]);
            e[i] = t[s] >>> a;
          }
        }),
        (UZIP.F._putsE = function (e, r, t) {
          t <<= 7 & r;
          var a = r >>> 3;
          (e[a] |= t), (e[a + 1] |= t >>> 8);
        }),
        (UZIP.F._putsF = function (e, r, t) {
          t <<= 7 & r;
          var a = r >>> 3;
          (e[a] |= t), (e[a + 1] |= t >>> 8), (e[a + 2] |= t >>> 16);
        }),
        (UZIP.F._bitsE = function (e, r, t) {
          return (
            ((e[r >>> 3] | (e[1 + (r >>> 3)] << 8)) >>> (7 & r)) &
            ((1 << t) - 1)
          );
        }),
        (UZIP.F._bitsF = function (e, r, t) {
          return (
            ((e[r >>> 3] |
              (e[1 + (r >>> 3)] << 8) |
              (e[2 + (r >>> 3)] << 16)) >>>
              (7 & r)) &
            ((1 << t) - 1)
          );
        }),
        (UZIP.F._get17 = function (e, r) {
          return (
            (e[r >>> 3] |
              (e[1 + (r >>> 3)] << 8) |
              (e[2 + (r >>> 3)] << 16)) >>>
            (7 & r)
          );
        }),
        (UZIP.F._get25 = function (e, r) {
          return (
            (e[r >>> 3] |
              (e[1 + (r >>> 3)] << 8) |
              (e[2 + (r >>> 3)] << 16) |
              (e[3 + (r >>> 3)] << 24)) >>>
            (7 & r)
          );
        }),
        (UZIP.F.U =
          ((r = Uint16Array),
          (t = Uint32Array),
          {
            next_code: new r(16),
            bl_count: new r(16),
            ordr: [
              16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
            ],
            of0: [
              3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
              51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999,
            ],
            exb: [
              0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4,
              4, 4, 5, 5, 5, 5, 0, 0, 0, 0,
            ],
            ldef: new r(32),
            df0: [
              1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257,
              385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289,
              16385, 24577, 65535, 65535,
            ],
            dxb: [
              0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
              10, 10, 11, 11, 12, 12, 13, 13, 0, 0,
            ],
            ddef: new t(32),
            flmap: new r(512),
            fltree: [],
            fdmap: new r(32),
            fdtree: [],
            lmap: new r(32768),
            ltree: [],
            ttree: [],
            dmap: new r(32768),
            dtree: [],
            imap: new r(512),
            itree: [],
            rev15: new r(32768),
            lhst: new t(286),
            dhst: new t(30),
            ihst: new t(19),
            lits: new t(15e3),
            strt: new r(65536),
            prev: new r(32768),
          })),
        (function () {
          for (var e = UZIP.F.U, r = 0; r < 32768; r++) {
            var t = r;
            (t =
              ((4278255360 &
                (t =
                  ((4042322160 &
                    (t =
                      ((3435973836 &
                        (t =
                          ((2863311530 & t) >>> 1) |
                          ((1431655765 & t) << 1))) >>>
                        2) |
                      ((858993459 & t) << 2))) >>>
                    4) |
                  ((252645135 & t) << 4))) >>>
                8) |
              ((16711935 & t) << 8)),
              (e.rev15[r] = ((t >>> 16) | (t << 16)) >>> 17);
          }
          function pushV(e, r, t) {
            for (; 0 != r--; ) e.push(0, t);
          }
          for (r = 0; r < 32; r++)
            (e.ldef[r] = (e.of0[r] << 3) | e.exb[r]),
              (e.ddef[r] = (e.df0[r] << 4) | e.dxb[r]);
          pushV(e.fltree, 144, 8),
            pushV(e.fltree, 112, 9),
            pushV(e.fltree, 24, 7),
            pushV(e.fltree, 8, 8),
            UZIP.F.makeCodes(e.fltree, 9),
            UZIP.F.codes2map(e.fltree, 9, e.flmap),
            UZIP.F.revCodes(e.fltree, 9),
            pushV(e.fdtree, 32, 5),
            UZIP.F.makeCodes(e.fdtree, 5),
            UZIP.F.codes2map(e.fdtree, 5, e.fdmap),
            UZIP.F.revCodes(e.fdtree, 5),
            pushV(e.itree, 19, 0),
            pushV(e.ltree, 286, 0),
            pushV(e.dtree, 30, 0),
            pushV(e.ttree, 320, 0);
        })();
    }),
    UZIP = Object.freeze(
      _mergeNamespaces({ __proto__: null, default: UZIP_1 }, [UZIP_1])
    ),
    UPNG = {},
    N,
    W,
    H;
  (UPNG.toRGBA8 = function (e) {
    var r = e.width,
      t = e.height;
    if (null == e.tabs.acTL)
      return [UPNG.toRGBA8.decodeImage(e.data, r, t, e).buffer];
    var a = [];
    null == e.frames[0].data && (e.frames[0].data = e.data);
    for (
      var i = r * t * 4,
        s = new Uint8Array(i),
        f = new Uint8Array(i),
        c = new Uint8Array(i),
        l = 0;
      l < e.frames.length;
      l++
    ) {
      var u = e.frames[l],
        d = u.rect.x,
        h = u.rect.y,
        A = u.rect.width,
        v = u.rect.height,
        p = UPNG.toRGBA8.decodeImage(u.data, A, v, e);
      if (0 != l) for (var m = 0; m < i; m++) c[m] = s[m];
      if (
        (0 == u.blend
          ? UPNG._copyTile(p, A, v, s, r, t, d, h, 0)
          : 1 == u.blend && UPNG._copyTile(p, A, v, s, r, t, d, h, 1),
        a.push(s.buffer.slice(0)),
        0 == u.dispose)
      );
      else if (1 == u.dispose) UPNG._copyTile(f, A, v, s, r, t, d, h, 0);
      else if (2 == u.dispose) for (m = 0; m < i; m++) s[m] = c[m];
    }
    return a;
  }),
    (UPNG.toRGBA8.decodeImage = function (e, r, t, a) {
      var i = r * t,
        s = UPNG.decode._getBPP(a),
        f = Math.ceil((r * s) / 8),
        c = new Uint8Array(4 * i),
        l = new Uint32Array(c.buffer),
        u = a.ctype,
        d = a.depth,
        h = UPNG._bin.readUshort;
      if (6 == u) {
        var A = i << 2;
        if (8 == d)
          for (var v = 0; v < A; v += 4)
            (c[v] = e[v]),
              (c[v + 1] = e[v + 1]),
              (c[v + 2] = e[v + 2]),
              (c[v + 3] = e[v + 3]);
        if (16 == d) for (v = 0; v < A; v++) c[v] = e[v << 1];
      } else if (2 == u) {
        var p = a.tabs.tRNS;
        if (null == p) {
          if (8 == d)
            for (v = 0; v < i; v++) {
              var m = 3 * v;
              l[v] = (255 << 24) | (e[m + 2] << 16) | (e[m + 1] << 8) | e[m];
            }
          if (16 == d)
            for (v = 0; v < i; v++) {
              m = 6 * v;
              l[v] = (255 << 24) | (e[m + 4] << 16) | (e[m + 2] << 8) | e[m];
            }
        } else {
          var g = p[0],
            U = p[1],
            w = p[2];
          if (8 == d)
            for (v = 0; v < i; v++) {
              var _ = v << 2;
              m = 3 * v;
              (l[v] = (255 << 24) | (e[m + 2] << 16) | (e[m + 1] << 8) | e[m]),
                e[m] == g && e[m + 1] == U && e[m + 2] == w && (c[_ + 3] = 0);
            }
          if (16 == d)
            for (v = 0; v < i; v++) {
              (_ = v << 2), (m = 6 * v);
              (l[v] = (255 << 24) | (e[m + 4] << 16) | (e[m + 2] << 8) | e[m]),
                h(e, m) == g &&
                  h(e, m + 2) == U &&
                  h(e, m + 4) == w &&
                  (c[_ + 3] = 0);
            }
        }
      } else if (3 == u) {
        var P = a.tabs.PLTE,
          b = a.tabs.tRNS,
          y = b ? b.length : 0;
        if (1 == d)
          for (var I = 0; I < t; I++) {
            var F = I * f,
              E = I * r;
            for (v = 0; v < r; v++) {
              _ = (E + v) << 2;
              var C = 3 * (B = (e[F + (v >> 3)] >> (7 - ((7 & v) << 0))) & 1);
              (c[_] = P[C]),
                (c[_ + 1] = P[C + 1]),
                (c[_ + 2] = P[C + 2]),
                (c[_ + 3] = B < y ? b[B] : 255);
            }
          }
        if (2 == d)
          for (I = 0; I < t; I++)
            for (F = I * f, E = I * r, v = 0; v < r; v++) {
              (_ = (E + v) << 2),
                (C = 3 * (B = (e[F + (v >> 2)] >> (6 - ((3 & v) << 1))) & 3));
              (c[_] = P[C]),
                (c[_ + 1] = P[C + 1]),
                (c[_ + 2] = P[C + 2]),
                (c[_ + 3] = B < y ? b[B] : 255);
            }
        if (4 == d)
          for (I = 0; I < t; I++)
            for (F = I * f, E = I * r, v = 0; v < r; v++) {
              (_ = (E + v) << 2),
                (C = 3 * (B = (e[F + (v >> 1)] >> (4 - ((1 & v) << 2))) & 15));
              (c[_] = P[C]),
                (c[_ + 1] = P[C + 1]),
                (c[_ + 2] = P[C + 2]),
                (c[_ + 3] = B < y ? b[B] : 255);
            }
        if (8 == d)
          for (v = 0; v < i; v++) {
            var B;
            (_ = v << 2), (C = 3 * (B = e[v]));
            (c[_] = P[C]),
              (c[_ + 1] = P[C + 1]),
              (c[_ + 2] = P[C + 2]),
              (c[_ + 3] = B < y ? b[B] : 255);
          }
      } else if (4 == u) {
        if (8 == d)
          for (v = 0; v < i; v++) {
            _ = v << 2;
            var R = e[(G = v << 1)];
            (c[_] = R), (c[_ + 1] = R), (c[_ + 2] = R), (c[_ + 3] = e[G + 1]);
          }
        if (16 == d)
          for (v = 0; v < i; v++) {
            var G;
            (_ = v << 2), (R = e[(G = v << 2)]);
            (c[_] = R), (c[_ + 1] = R), (c[_ + 2] = R), (c[_ + 3] = e[G + 2]);
          }
      } else if (0 == u)
        for (g = a.tabs.tRNS ? a.tabs.tRNS : -1, I = 0; I < t; I++) {
          var M = I * f,
            O = I * r;
          if (1 == d)
            for (var x = 0; x < r; x++) {
              var S =
                (R = 255 * ((e[M + (x >>> 3)] >>> (7 - (7 & x))) & 1)) ==
                255 * g
                  ? 0
                  : 255;
              l[O + x] = (S << 24) | (R << 16) | (R << 8) | R;
            }
          else if (2 == d)
            for (x = 0; x < r; x++) {
              S =
                (R = 85 * ((e[M + (x >>> 2)] >>> (6 - ((3 & x) << 1))) & 3)) ==
                85 * g
                  ? 0
                  : 255;
              l[O + x] = (S << 24) | (R << 16) | (R << 8) | R;
            }
          else if (4 == d)
            for (x = 0; x < r; x++) {
              S =
                (R = 17 * ((e[M + (x >>> 1)] >>> (4 - ((1 & x) << 2))) & 15)) ==
                17 * g
                  ? 0
                  : 255;
              l[O + x] = (S << 24) | (R << 16) | (R << 8) | R;
            }
          else if (8 == d)
            for (x = 0; x < r; x++) {
              S = (R = e[M + x]) == g ? 0 : 255;
              l[O + x] = (S << 24) | (R << 16) | (R << 8) | R;
            }
          else if (16 == d)
            for (x = 0; x < r; x++) {
              (R = e[M + (x << 1)]), (S = h(e, M + (x << v)) == g ? 0 : 255);
              l[O + x] = (S << 24) | (R << 16) | (R << 8) | R;
            }
        }
      return c;
    }),
    (UPNG.decode = function (e) {
      for (
        var r,
          t = new Uint8Array(e),
          a = 8,
          i = UPNG._bin,
          s = i.readUshort,
          f = i.readUint,
          c = { tabs: {}, frames: [] },
          l = new Uint8Array(t.length),
          u = 0,
          d = 0,
          h = [137, 80, 78, 71, 13, 10, 26, 10],
          A = 0;
        A < 8;
        A++
      )
        if (t[A] != h[A]) throw "The input is not a PNG file!";
      for (; a < t.length; ) {
        var v = i.readUint(t, a);
        a += 4;
        var p = i.readASCII(t, a, 4);
        if (((a += 4), "IHDR" == p)) UPNG.decode._IHDR(t, a, c);
        else if ("CgBI" == p) c.tabs[p] = t.slice(a, a + 4);
        else if ("IDAT" == p) {
          for (A = 0; A < v; A++) l[u + A] = t[a + A];
          u += v;
        } else if ("acTL" == p)
          (c.tabs[p] = { num_frames: f(t, a), num_plays: f(t, a + 4) }),
            (r = new Uint8Array(t.length));
        else if ("fcTL" == p) {
          var m;
          if (0 != d)
            ((m = c.frames[c.frames.length - 1]).data = UPNG.decode._decompress(
              c,
              r.slice(0, d),
              m.rect.width,
              m.rect.height
            )),
              (d = 0);
          var g = {
              x: f(t, a + 12),
              y: f(t, a + 16),
              width: f(t, a + 4),
              height: f(t, a + 8),
            },
            U = s(t, a + 22);
          U = s(t, a + 20) / (0 == U ? 100 : U);
          var w = {
            rect: g,
            delay: Math.round(1e3 * U),
            dispose: t[a + 24],
            blend: t[a + 25],
          };
          c.frames.push(w);
        } else if ("fdAT" == p) {
          for (A = 0; A < v - 4; A++) r[d + A] = t[a + A + 4];
          d += v - 4;
        } else if ("pHYs" == p)
          c.tabs[p] = [i.readUint(t, a), i.readUint(t, a + 4), t[a + 8]];
        else if ("cHRM" == p) {
          c.tabs[p] = [];
          for (A = 0; A < 8; A++) c.tabs[p].push(i.readUint(t, a + 4 * A));
        } else if ("tEXt" == p || "zTXt" == p) {
          null == c.tabs[p] && (c.tabs[p] = {});
          var _ = i.nextZero(t, a),
            P = i.readASCII(t, a, _ - a),
            b = a + v - _ - 1;
          if ("tEXt" == p) F = i.readASCII(t, _ + 1, b);
          else {
            var y = UPNG.decode._inflate(t.slice(_ + 2, _ + 2 + b));
            F = i.readUTF8(y, 0, y.length);
          }
          c.tabs[p][P] = F;
        } else if ("iTXt" == p) {
          null == c.tabs[p] && (c.tabs[p] = {});
          _ = 0;
          var I = a;
          _ = i.nextZero(t, I);
          P = i.readASCII(t, I, _ - I);
          var F,
            E = t[(I = _ + 1)];
          t[I + 1],
            (I += 2),
            (_ = i.nextZero(t, I)),
            i.readASCII(t, I, _ - I),
            (I = _ + 1),
            (_ = i.nextZero(t, I)),
            i.readUTF8(t, I, _ - I);
          b = v - ((I = _ + 1) - a);
          if (0 == E) F = i.readUTF8(t, I, b);
          else {
            y = UPNG.decode._inflate(t.slice(I, I + b));
            F = i.readUTF8(y, 0, y.length);
          }
          c.tabs[p][P] = F;
        } else if ("PLTE" == p) c.tabs[p] = i.readBytes(t, a, v);
        else if ("hIST" == p) {
          var C = c.tabs.PLTE.length / 3;
          c.tabs[p] = [];
          for (A = 0; A < C; A++) c.tabs[p].push(s(t, a + 2 * A));
        } else if ("tRNS" == p)
          3 == c.ctype
            ? (c.tabs[p] = i.readBytes(t, a, v))
            : 0 == c.ctype
            ? (c.tabs[p] = s(t, a))
            : 2 == c.ctype && (c.tabs[p] = [s(t, a), s(t, a + 2), s(t, a + 4)]);
        else if ("gAMA" == p) c.tabs[p] = i.readUint(t, a) / 1e5;
        else if ("sRGB" == p) c.tabs[p] = t[a];
        else if ("bKGD" == p)
          0 == c.ctype || 4 == c.ctype
            ? (c.tabs[p] = [s(t, a)])
            : 2 == c.ctype || 6 == c.ctype
            ? (c.tabs[p] = [s(t, a), s(t, a + 2), s(t, a + 4)])
            : 3 == c.ctype && (c.tabs[p] = t[a]);
        else if ("IEND" == p) break;
        (a += v), i.readUint(t, a), (a += 4);
      }
      0 != d &&
        (((m = c.frames[c.frames.length - 1]).data = UPNG.decode._decompress(
          c,
          r.slice(0, d),
          m.rect.width,
          m.rect.height
        )),
        (d = 0));
      return (
        (c.data = UPNG.decode._decompress(c, l, c.width, c.height)),
        delete c.compress,
        delete c.interlace,
        delete c.filter,
        c
      );
    }),
    (UPNG.decode._decompress = function (e, r, t, a) {
      var i = UPNG.decode._getBPP(e),
        s = Math.ceil((t * i) / 8),
        f = new Uint8Array((s + 1 + e.interlace) * a);
      return (
        (r = e.tabs.CgBI ? UPNG.inflateRaw(r, f) : UPNG.decode._inflate(r, f)),
        0 == e.interlace
          ? (r = UPNG.decode._filterZero(r, e, 0, t, a))
          : 1 == e.interlace && (r = UPNG.decode._readInterlace(r, e)),
        r
      );
    }),
    (UPNG.decode._inflate = function (e, r) {
      return UPNG.inflateRaw(new Uint8Array(e.buffer, 2, e.length - 6), r);
    }),
    (UPNG.inflateRaw =
      ((H = {}),
      (H.H = {}),
      (H.H.N = function (e, r) {
        var t,
          a,
          i = Uint8Array,
          s = 0,
          f = 0,
          c = 0,
          l = 0,
          u = 0,
          d = 0,
          h = 0,
          A = 0,
          v = 0;
        if (3 == e[0] && 0 == e[1]) return r || new i(0);
        var p = H.H,
          m = p.b,
          g = p.e,
          U = p.R,
          w = p.n,
          _ = p.A,
          P = p.Z,
          b = p.m,
          y = null == r;
        for (y && (r = new i((e.length >>> 2) << 5)); 0 == s; )
          if (((s = m(e, v, 1)), (f = m(e, v + 1, 2)), (v += 3), 0 != f)) {
            if (
              (y && (r = H.H.W(r, A + (1 << 17))),
              1 == f && ((t = b.J), (a = b.h), (d = 511), (h = 31)),
              2 == f)
            ) {
              (c = g(e, v, 5) + 257),
                (l = g(e, v + 5, 5) + 1),
                (u = g(e, v + 10, 4) + 4),
                (v += 14);
              for (var I = 1, F = 0; F < 38; F += 2)
                (b.Q[F] = 0), (b.Q[F + 1] = 0);
              for (F = 0; F < u; F++) {
                var E = g(e, v + 3 * F, 3);
                (b.Q[1 + (b.X[F] << 1)] = E), E > I && (I = E);
              }
              (v += 3 * u),
                w(b.Q, I),
                _(b.Q, I, b.u),
                (t = b.w),
                (a = b.d),
                (v = U(b.u, (1 << I) - 1, c + l, e, v, b.v));
              var C = p.V(b.v, 0, c, b.C);
              d = (1 << C) - 1;
              var B = p.V(b.v, c, l, b.D);
              (h = (1 << B) - 1),
                w(b.C, C),
                _(b.C, C, t),
                w(b.D, B),
                _(b.D, B, a);
            }
            for (;;) {
              var R = t[P(e, v) & d];
              v += 15 & R;
              var G = R >>> 4;
              if (G >>> 8 == 0) r[A++] = G;
              else {
                if (256 == G) break;
                var M = A + G - 254;
                if (G > 264) {
                  var O = b.q[G - 257];
                  (M = A + (O >>> 3) + g(e, v, 7 & O)), (v += 7 & O);
                }
                var x = a[P(e, v) & h];
                v += 15 & x;
                var S = x >>> 4,
                  Z = b.c[S],
                  T = (Z >>> 4) + m(e, v, 15 & Z);
                for (v += 15 & Z; A < M; )
                  (r[A] = r[A++ - T]),
                    (r[A] = r[A++ - T]),
                    (r[A] = r[A++ - T]),
                    (r[A] = r[A++ - T]);
                A = M;
              }
            }
          } else {
            0 != (7 & v) && (v += 8 - (7 & v));
            var Q = 4 + (v >>> 3),
              D = e[Q - 4] | (e[Q - 3] << 8);
            y && (r = H.H.W(r, A + D)),
              r.set(new i(e.buffer, e.byteOffset + Q, D), A),
              (v = (Q + D) << 3),
              (A += D);
          }
        return r.length == A ? r : r.slice(0, A);
      }),
      (H.H.W = function (e, r) {
        var t = e.length;
        if (r <= t) return e;
        var a = new Uint8Array(t << 1);
        return a.set(e, 0), a;
      }),
      (H.H.R = function (e, r, t, a, i, s) {
        for (var f = H.H.e, c = H.H.Z, l = 0; l < t; ) {
          var u = e[c(a, i) & r];
          i += 15 & u;
          var d = u >>> 4;
          if (d <= 15) (s[l] = d), l++;
          else {
            var h = 0,
              A = 0;
            16 == d
              ? ((A = 3 + f(a, i, 2)), (i += 2), (h = s[l - 1]))
              : 17 == d
              ? ((A = 3 + f(a, i, 3)), (i += 3))
              : 18 == d && ((A = 11 + f(a, i, 7)), (i += 7));
            for (var v = l + A; l < v; ) (s[l] = h), l++;
          }
        }
        return i;
      }),
      (H.H.V = function (e, r, t, a) {
        for (var i = 0, s = 0, f = a.length >>> 1; s < t; ) {
          var c = e[s + r];
          (a[s << 1] = 0), (a[1 + (s << 1)] = c), c > i && (i = c), s++;
        }
        for (; s < f; ) (a[s << 1] = 0), (a[1 + (s << 1)] = 0), s++;
        return i;
      }),
      (H.H.n = function (e, r) {
        for (
          var t, a, i, s, f = H.H.m, c = e.length, l = f.j, u = 0;
          u <= r;
          u++
        )
          l[u] = 0;
        for (u = 1; u < c; u += 2) l[e[u]]++;
        var d = f.K;
        for (t = 0, l[0] = 0, a = 1; a <= r; a++)
          (t = (t + l[a - 1]) << 1), (d[a] = t);
        for (i = 0; i < c; i += 2)
          0 != (s = e[i + 1]) && ((e[i] = d[s]), d[s]++);
      }),
      (H.H.A = function (e, r, t) {
        for (var a = e.length, i = H.H.m.r, s = 0; s < a; s += 2)
          if (0 != e[s + 1])
            for (
              var f = s >> 1,
                c = e[s + 1],
                l = (f << 4) | c,
                u = r - c,
                d = e[s] << u,
                h = d + (1 << u);
              d != h;

            )
              (t[i[d] >>> (15 - r)] = l), d++;
      }),
      (H.H.l = function (e, r) {
        for (var t = H.H.m.r, a = 15 - r, i = 0; i < e.length; i += 2) {
          var s = e[i] << (r - e[i + 1]);
          e[i] = t[s] >>> a;
        }
      }),
      (H.H.M = function (e, r, t) {
        t <<= 7 & r;
        var a = r >>> 3;
        (e[a] |= t), (e[a + 1] |= t >>> 8);
      }),
      (H.H.I = function (e, r, t) {
        t <<= 7 & r;
        var a = r >>> 3;
        (e[a] |= t), (e[a + 1] |= t >>> 8), (e[a + 2] |= t >>> 16);
      }),
      (H.H.e = function (e, r, t) {
        return (
          ((e[r >>> 3] | (e[1 + (r >>> 3)] << 8)) >>> (7 & r)) & ((1 << t) - 1)
        );
      }),
      (H.H.b = function (e, r, t) {
        return (
          ((e[r >>> 3] | (e[1 + (r >>> 3)] << 8) | (e[2 + (r >>> 3)] << 16)) >>>
            (7 & r)) &
          ((1 << t) - 1)
        );
      }),
      (H.H.Z = function (e, r) {
        return (
          (e[r >>> 3] | (e[1 + (r >>> 3)] << 8) | (e[2 + (r >>> 3)] << 16)) >>>
          (7 & r)
        );
      }),
      (H.H.i = function (e, r) {
        return (
          (e[r >>> 3] |
            (e[1 + (r >>> 3)] << 8) |
            (e[2 + (r >>> 3)] << 16) |
            (e[3 + (r >>> 3)] << 24)) >>>
          (7 & r)
        );
      }),
      (H.H.m =
        ((N = Uint16Array),
        (W = Uint32Array),
        {
          K: new N(16),
          j: new N(16),
          X: [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
          S: [
            3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51,
            59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 999, 999, 999,
          ],
          T: [
            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4,
            4, 5, 5, 5, 5, 0, 0, 0, 0,
          ],
          q: new N(32),
          p: [
            1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385,
            513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385,
            24577, 65535, 65535,
          ],
          z: [
            0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
            10, 10, 11, 11, 12, 12, 13, 13, 0, 0,
          ],
          c: new W(32),
          J: new N(512),
          _: [],
          h: new N(32),
          $: [],
          w: new N(32768),
          C: [],
          v: [],
          d: new N(32768),
          D: [],
          u: new N(512),
          Q: [],
          r: new N(32768),
          s: new W(286),
          Y: new W(30),
          a: new W(19),
          t: new W(15e3),
          k: new N(65536),
          g: new N(32768),
        })),
      (function () {
        for (var e = H.H.m, r = 0; r < 32768; r++) {
          var t = r;
          (t =
            ((4278255360 &
              (t =
                ((4042322160 &
                  (t =
                    ((3435973836 &
                      (t =
                        ((2863311530 & t) >>> 1) | ((1431655765 & t) << 1))) >>>
                      2) |
                    ((858993459 & t) << 2))) >>>
                  4) |
                ((252645135 & t) << 4))) >>>
              8) |
            ((16711935 & t) << 8)),
            (e.r[r] = ((t >>> 16) | (t << 16)) >>> 17);
        }
        function n(e, r, t) {
          for (; 0 != r--; ) e.push(0, t);
        }
        for (r = 0; r < 32; r++)
          (e.q[r] = (e.S[r] << 3) | e.T[r]), (e.c[r] = (e.p[r] << 4) | e.z[r]);
        n(e._, 144, 8),
          n(e._, 112, 9),
          n(e._, 24, 7),
          n(e._, 8, 8),
          H.H.n(e._, 9),
          H.H.A(e._, 9, e.J),
          H.H.l(e._, 9),
          n(e.$, 32, 5),
          H.H.n(e.$, 5),
          H.H.A(e.$, 5, e.h),
          H.H.l(e.$, 5),
          n(e.Q, 19, 0),
          n(e.C, 286, 0),
          n(e.D, 30, 0),
          n(e.v, 320, 0);
      })(),
      H.H.N)),
    (UPNG.decode._readInterlace = function (e, r) {
      for (
        var t = r.width,
          a = r.height,
          i = UPNG.decode._getBPP(r),
          s = i >> 3,
          f = Math.ceil((t * i) / 8),
          c = new Uint8Array(a * f),
          l = 0,
          u = [0, 0, 4, 0, 2, 0, 1],
          d = [0, 4, 0, 2, 0, 1, 0],
          h = [8, 8, 8, 4, 4, 2, 2],
          A = [8, 8, 4, 4, 2, 2, 1],
          v = 0;
        v < 7;

      ) {
        for (var p = h[v], m = A[v], g = 0, U = 0, w = u[v]; w < a; )
          (w += p), U++;
        for (var _ = d[v]; _ < t; ) (_ += m), g++;
        var P = Math.ceil((g * i) / 8);
        UPNG.decode._filterZero(e, r, l, g, U);
        for (var b = 0, y = u[v]; y < a; ) {
          for (var I = d[v], F = (l + b * P) << 3; I < t; ) {
            var E;
            if (1 == i)
              (E = ((E = e[F >> 3]) >> (7 - (7 & F))) & 1),
                (c[y * f + (I >> 3)] |= E << (7 - ((7 & I) << 0)));
            if (2 == i)
              (E = ((E = e[F >> 3]) >> (6 - (7 & F))) & 3),
                (c[y * f + (I >> 2)] |= E << (6 - ((3 & I) << 1)));
            if (4 == i)
              (E = ((E = e[F >> 3]) >> (4 - (7 & F))) & 15),
                (c[y * f + (I >> 1)] |= E << (4 - ((1 & I) << 2)));
            if (i >= 8)
              for (var C = y * f + I * s, B = 0; B < s; B++)
                c[C + B] = e[(F >> 3) + B];
            (F += i), (I += m);
          }
          b++, (y += p);
        }
        g * U != 0 && (l += U * (1 + P)), (v += 1);
      }
      return c;
    }),
    (UPNG.decode._getBPP = function (e) {
      return [1, null, 3, 1, 2, null, 4][e.ctype] * e.depth;
    }),
    (UPNG.decode._filterZero = function (e, r, t, a, i) {
      var s = UPNG.decode._getBPP(r),
        f = Math.ceil((a * s) / 8),
        c = UPNG.decode._paeth;
      s = Math.ceil(s / 8);
      var l = 0,
        u = 1,
        d = e[t],
        h = 0;
      if ((d > 1 && (e[t] = [0, 0, 1][d - 2]), 3 == d))
        for (h = s; h < f; h++)
          e[h + 1] = (e[h + 1] + (e[h + 1 - s] >>> 1)) & 255;
      for (var A = 0; A < i; A++)
        if (((h = 0), 0 == (d = e[(u = (l = t + A * f) + A + 1) - 1])))
          for (; h < f; h++) e[l + h] = e[u + h];
        else if (1 == d) {
          for (; h < s; h++) e[l + h] = e[u + h];
          for (; h < f; h++) e[l + h] = e[u + h] + e[l + h - s];
        } else if (2 == d)
          for (; h < f; h++) e[l + h] = e[u + h] + e[l + h - f];
        else if (3 == d) {
          for (; h < s; h++) e[l + h] = e[u + h] + (e[l + h - f] >>> 1);
          for (; h < f; h++)
            e[l + h] = e[u + h] + ((e[l + h - f] + e[l + h - s]) >>> 1);
        } else {
          for (; h < s; h++) e[l + h] = e[u + h] + c(0, e[l + h - f], 0);
          for (; h < f; h++)
            e[l + h] =
              e[u + h] + c(e[l + h - s], e[l + h - f], e[l + h - s - f]);
        }
      return e;
    }),
    (UPNG.decode._paeth = function (e, r, t) {
      var a = e + r - t,
        i = a - e,
        s = a - r,
        f = a - t;
      return i * i <= s * s && i * i <= f * f ? e : s * s <= f * f ? r : t;
    }),
    (UPNG.decode._IHDR = function (e, r, t) {
      var a = UPNG._bin;
      (t.width = a.readUint(e, r)),
        (r += 4),
        (t.height = a.readUint(e, r)),
        (r += 4),
        (t.depth = e[r]),
        r++,
        (t.ctype = e[r]),
        r++,
        (t.compress = e[r]),
        r++,
        (t.filter = e[r]),
        r++,
        (t.interlace = e[r]),
        r++;
    }),
    (UPNG._bin = {
      nextZero: function nextZero(e, r) {
        for (; 0 != e[r]; ) r++;
        return r;
      },
      readUshort: function readUshort(e, r) {
        return (e[r] << 8) | e[r + 1];
      },
      writeUshort: function writeUshort(e, r, t) {
        (e[r] = (t >> 8) & 255), (e[r + 1] = 255 & t);
      },
      readUint: function readUint(e, r) {
        return (
          16777216 * e[r] + ((e[r + 1] << 16) | (e[r + 2] << 8) | e[r + 3])
        );
      },
      writeUint: function writeUint(e, r, t) {
        (e[r] = (t >> 24) & 255),
          (e[r + 1] = (t >> 16) & 255),
          (e[r + 2] = (t >> 8) & 255),
          (e[r + 3] = 255 & t);
      },
      readASCII: function readASCII(e, r, t) {
        for (var a = "", i = 0; i < t; i++) a += String.fromCharCode(e[r + i]);
        return a;
      },
      writeASCII: function writeASCII(e, r, t) {
        for (var a = 0; a < t.length; a++) e[r + a] = t.charCodeAt(a);
      },
      readBytes: function readBytes(e, r, t) {
        for (var a = [], i = 0; i < t; i++) a.push(e[r + i]);
        return a;
      },
      pad: function pad(e) {
        return e.length < 2 ? "0".concat(e) : e;
      },
      readUTF8: function readUTF8(e, r, t) {
        for (var a, i = "", s = 0; s < t; s++)
          i += "%".concat(UPNG._bin.pad(e[r + s].toString(16)));
        try {
          a = decodeURIComponent(i);
        } catch (a) {
          return UPNG._bin.readASCII(e, r, t);
        }
        return a;
      },
    }),
    (UPNG._copyTile = function (e, r, t, a, i, s, f, c, l) {
      for (
        var u = Math.min(r, i), d = Math.min(t, s), h = 0, A = 0, v = 0;
        v < d;
        v++
      )
        for (var p = 0; p < u; p++)
          if (
            (f >= 0 && c >= 0
              ? ((h = (v * r + p) << 2), (A = ((c + v) * i + f + p) << 2))
              : ((h = ((-c + v) * r - f + p) << 2), (A = (v * i + p) << 2)),
            0 == l)
          )
            (a[A] = e[h]),
              (a[A + 1] = e[h + 1]),
              (a[A + 2] = e[h + 2]),
              (a[A + 3] = e[h + 3]);
          else if (1 == l) {
            var m = e[h + 3] * (1 / 255),
              g = e[h] * m,
              U = e[h + 1] * m,
              w = e[h + 2] * m,
              _ = a[A + 3] * (1 / 255),
              P = a[A] * _,
              b = a[A + 1] * _,
              y = a[A + 2] * _,
              I = 1 - m,
              F = m + _ * I,
              E = 0 == F ? 0 : 1 / F;
            (a[A + 3] = 255 * F),
              (a[A + 0] = (g + P * I) * E),
              (a[A + 1] = (U + b * I) * E),
              (a[A + 2] = (w + y * I) * E);
          } else if (2 == l) {
            (m = e[h + 3]),
              (g = e[h]),
              (U = e[h + 1]),
              (w = e[h + 2]),
              (_ = a[A + 3]),
              (P = a[A]),
              (b = a[A + 1]),
              (y = a[A + 2]);
            m == _ && g == P && U == b && w == y
              ? ((a[A] = 0), (a[A + 1] = 0), (a[A + 2] = 0), (a[A + 3] = 0))
              : ((a[A] = g), (a[A + 1] = U), (a[A + 2] = w), (a[A + 3] = m));
          } else if (3 == l) {
            (m = e[h + 3]),
              (g = e[h]),
              (U = e[h + 1]),
              (w = e[h + 2]),
              (_ = a[A + 3]),
              (P = a[A]),
              (b = a[A + 1]),
              (y = a[A + 2]);
            if (m == _ && g == P && U == b && w == y) continue;
            if (m < 220 && _ > 20) return !1;
          }
      return !0;
    }),
    (UPNG.encode = function (e, r, t, a, i, s, f) {
      null == a && (a = 0), null == f && (f = !1);
      var c = UPNG.encode.compress(e, r, t, a, [!1, !1, !1, 0, f]);
      return UPNG.encode.compressPNG(c, -1), UPNG.encode._main(c, r, t, i, s);
    }),
    (UPNG.encodeLL = function (e, r, t, a, i, s, f, c) {
      for (
        var l = {
            ctype: 0 + (1 == a ? 0 : 2) + (0 == i ? 0 : 4),
            depth: s,
            frames: [],
          },
          u = (a + i) * s,
          d = u * r,
          h = 0;
        h < e.length;
        h++
      )
        l.frames.push({
          rect: { x: 0, y: 0, width: r, height: t },
          img: new Uint8Array(e[h]),
          blend: 0,
          dispose: 1,
          bpp: Math.ceil(u / 8),
          bpl: Math.ceil(d / 8),
        });
      return (
        UPNG.encode.compressPNG(l, 0, !0), UPNG.encode._main(l, r, t, f, c)
      );
    }),
    (UPNG.encode._main = function (e, r, t, a, i) {
      null == i && (i = {});
      var s = UPNG.crc.crc,
        f = UPNG._bin.writeUint,
        c = UPNG._bin.writeUshort,
        l = UPNG._bin.writeASCII,
        u = 8,
        d = e.frames.length > 1,
        h = !1,
        A = 33 + (d ? 20 : 0);
      if (
        (null != i.sRGB && (A += 13), null != i.pHYs && (A += 21), 3 == e.ctype)
      ) {
        for (var v = e.plte.length, p = 0; p < v; p++)
          e.plte[p] >>> 24 != 255 && (h = !0);
        A += 8 + 3 * v + 4 + (h ? 8 + 1 * v + 4 : 0);
      }
      for (var m = 0; m < e.frames.length; m++) {
        d && (A += 38),
          (A += (F = e.frames[m]).cimg.length + 12),
          0 != m && (A += 4);
      }
      A += 12;
      var g = new Uint8Array(A),
        U = [137, 80, 78, 71, 13, 10, 26, 10];
      for (p = 0; p < 8; p++) g[p] = U[p];
      if (
        (f(g, u, 13),
        l(g, (u += 4), "IHDR"),
        f(g, (u += 4), r),
        f(g, (u += 4), t),
        (g[(u += 4)] = e.depth),
        (g[++u] = e.ctype),
        (g[++u] = 0),
        (g[++u] = 0),
        (g[++u] = 0),
        f(g, ++u, s(g, u - 17, 17)),
        (u += 4),
        null != i.sRGB &&
          (f(g, u, 1),
          l(g, (u += 4), "sRGB"),
          (g[(u += 4)] = i.sRGB),
          f(g, ++u, s(g, u - 5, 5)),
          (u += 4)),
        null != i.pHYs &&
          (f(g, u, 9),
          l(g, (u += 4), "pHYs"),
          f(g, (u += 4), i.pHYs[0]),
          f(g, (u += 4), i.pHYs[1]),
          (g[(u += 4)] = i.pHYs[2]),
          f(g, ++u, s(g, u - 13, 13)),
          (u += 4)),
        d &&
          (f(g, u, 8),
          l(g, (u += 4), "acTL"),
          f(g, (u += 4), e.frames.length),
          f(g, (u += 4), null != i.loop ? i.loop : 0),
          f(g, (u += 4), s(g, u - 12, 12)),
          (u += 4)),
        3 == e.ctype)
      ) {
        f(g, u, 3 * (v = e.plte.length)), l(g, (u += 4), "PLTE"), (u += 4);
        for (p = 0; p < v; p++) {
          var w = 3 * p,
            _ = e.plte[p],
            P = 255 & _,
            b = (_ >>> 8) & 255,
            y = (_ >>> 16) & 255;
          (g[u + w + 0] = P), (g[u + w + 1] = b), (g[u + w + 2] = y);
        }
        if ((f(g, (u += 3 * v), s(g, u - 3 * v - 4, 3 * v + 4)), (u += 4), h)) {
          f(g, u, v), l(g, (u += 4), "tRNS"), (u += 4);
          for (p = 0; p < v; p++) g[u + p] = (e.plte[p] >>> 24) & 255;
          f(g, (u += v), s(g, u - v - 4, v + 4)), (u += 4);
        }
      }
      var I = 0;
      for (m = 0; m < e.frames.length; m++) {
        var F = e.frames[m];
        d &&
          (f(g, u, 26),
          l(g, (u += 4), "fcTL"),
          f(g, (u += 4), I++),
          f(g, (u += 4), F.rect.width),
          f(g, (u += 4), F.rect.height),
          f(g, (u += 4), F.rect.x),
          f(g, (u += 4), F.rect.y),
          c(g, (u += 4), a[m]),
          c(g, (u += 2), 1e3),
          (g[(u += 2)] = F.dispose),
          (g[++u] = F.blend),
          f(g, ++u, s(g, u - 30, 30)),
          (u += 4));
        var E = F.cimg;
        f(g, u, (v = E.length) + (0 == m ? 0 : 4));
        var C = (u += 4);
        l(g, u, 0 == m ? "IDAT" : "fdAT"),
          (u += 4),
          0 != m && (f(g, u, I++), (u += 4)),
          g.set(E, u),
          f(g, (u += v), s(g, C, u - C)),
          (u += 4);
      }
      return (
        f(g, u, 0),
        l(g, (u += 4), "IEND"),
        f(g, (u += 4), s(g, u - 4, 4)),
        (u += 4),
        g.buffer
      );
    }),
    (UPNG.encode.compressPNG = function (e, r, t) {
      for (var a = 0; a < e.frames.length; a++) {
        var i = e.frames[a];
        i.rect.width;
        var s = i.rect.height,
          f = new Uint8Array(s * i.bpl + s);
        i.cimg = UPNG.encode._filterZero(i.img, s, i.bpp, i.bpl, f, r, t);
      }
    }),
    (UPNG.encode.compress = function (e, r, t, a, i) {
      for (
        var s = i[0],
          f = i[1],
          c = i[2],
          l = i[3],
          u = i[4],
          d = 6,
          h = 8,
          A = 255,
          v = 0;
        v < e.length;
        v++
      )
        for (var p = new Uint8Array(e[v]), m = p.length, g = 0; g < m; g += 4)
          A &= p[g + 3];
      var U = 255 != A,
        w = UPNG.encode.framize(e, r, t, s, f, c),
        _ = {},
        P = [],
        b = [];
      if (0 != a) {
        var y = [];
        for (g = 0; g < w.length; g++) y.push(w[g].img.buffer);
        var I = UPNG.encode.concatRGBA(y),
          F = UPNG.quantize(I, a),
          E = 0,
          C = new Uint8Array(F.abuf);
        for (g = 0; g < w.length; g++) {
          var B = (K = w[g].img).length;
          b.push(new Uint8Array(F.inds.buffer, E >> 2, B >> 2));
          for (v = 0; v < B; v += 4)
            (K[v] = C[E + v]),
              (K[v + 1] = C[E + v + 1]),
              (K[v + 2] = C[E + v + 2]),
              (K[v + 3] = C[E + v + 3]);
          E += B;
        }
        for (g = 0; g < F.plte.length; g++) P.push(F.plte[g].est.rgba);
      } else
        for (v = 0; v < w.length; v++) {
          var R = w[v],
            G = new Uint32Array(R.img.buffer),
            M = R.rect.width,
            O = ((m = G.length), new Uint8Array(m));
          b.push(O);
          for (g = 0; g < m; g++) {
            var x = G[g];
            if (0 != g && x == G[g - 1]) O[g] = O[g - 1];
            else if (g > M && x == G[g - M]) O[g] = O[g - M];
            else {
              var S = _[x];
              if (
                null == S &&
                ((_[x] = S = P.length), P.push(x), P.length >= 300)
              )
                break;
              O[g] = S;
            }
          }
        }
      var Z = P.length;
      Z <= 256 &&
        0 == u &&
        ((h = Z <= 2 ? 1 : Z <= 4 ? 2 : Z <= 16 ? 4 : 8), (h = Math.max(h, l)));
      for (v = 0; v < w.length; v++) {
        (R = w[v]).rect.x, R.rect.y;
        M = R.rect.width;
        var T = R.rect.height,
          Q = R.img;
        new Uint32Array(Q.buffer);
        var D = 4 * M,
          z = 4;
        if (Z <= 256 && 0 == u) {
          D = Math.ceil((h * M) / 8);
          for (var V = new Uint8Array(D * T), L = b[v], k = 0; k < T; k++) {
            g = k * D;
            var q = k * M;
            if (8 == h) for (var j = 0; j < M; j++) V[g + j] = L[q + j];
            else if (4 == h)
              for (j = 0; j < M; j++)
                V[g + (j >> 1)] |= L[q + j] << (4 - 4 * (1 & j));
            else if (2 == h)
              for (j = 0; j < M; j++)
                V[g + (j >> 2)] |= L[q + j] << (6 - 2 * (3 & j));
            else if (1 == h)
              for (j = 0; j < M; j++)
                V[g + (j >> 3)] |= L[q + j] << (7 - 1 * (7 & j));
          }
          (Q = V), (d = 3), (z = 1);
        } else if (0 == U && 1 == w.length) {
          V = new Uint8Array(M * T * 3);
          var $ = M * T;
          for (g = 0; g < $; g++) {
            var K,
              X = 4 * g;
            (V[(K = 3 * g)] = Q[X]),
              (V[K + 1] = Q[X + 1]),
              (V[K + 2] = Q[X + 2]);
          }
          (Q = V), (d = 2), (z = 3), (D = 3 * M);
        }
        (R.img = Q), (R.bpl = D), (R.bpp = z);
      }
      return { ctype: d, depth: h, plte: P, frames: w };
    }),
    (UPNG.encode.framize = function (e, r, t, a, i, s) {
      for (var f = [], c = 0; c < e.length; c++) {
        var l,
          u = new Uint8Array(e[c]),
          d = new Uint32Array(u.buffer),
          h = 0,
          A = 0,
          v = r,
          p = t,
          m = a ? 1 : 0;
        if (0 != c) {
          for (
            var g = s || a || 1 == c || 0 != f[c - 2].dispose ? 1 : 2,
              U = 0,
              w = 1e9,
              _ = 0;
            _ < g;
            _++
          ) {
            for (
              var P = new Uint8Array(e[c - 1 - _]),
                b = new Uint32Array(e[c - 1 - _]),
                y = r,
                I = t,
                F = -1,
                E = -1,
                C = 0;
              C < t;
              C++
            )
              for (var B = 0; B < r; B++) {
                d[(Z = C * r + B)] != b[Z] &&
                  (B < y && (y = B),
                  B > F && (F = B),
                  C < I && (I = C),
                  C > E && (E = C));
              }
            -1 == F && (y = I = F = E = 0),
              i && (1 == (1 & y) && y--, 1 == (1 & I) && I--);
            var R = (F - y + 1) * (E - I + 1);
            R < w &&
              ((w = R),
              (U = _),
              (h = y),
              (A = I),
              (v = F - y + 1),
              (p = E - I + 1));
          }
          P = new Uint8Array(e[c - 1 - U]);
          1 == U && (f[c - 1].dispose = 2),
            (l = new Uint8Array(v * p * 4)),
            UPNG._copyTile(P, r, t, l, v, p, -h, -A, 0),
            1 == (m = UPNG._copyTile(u, r, t, l, v, p, -h, -A, 3) ? 1 : 0)
              ? UPNG.encode._prepareDiff(u, r, t, l, {
                  x: h,
                  y: A,
                  width: v,
                  height: p,
                })
              : UPNG._copyTile(u, r, t, l, v, p, -h, -A, 0);
        } else l = u.slice(0);
        f.push({
          rect: { x: h, y: A, width: v, height: p },
          img: l,
          blend: m,
          dispose: 0,
        });
      }
      if (a)
        for (c = 0; c < f.length; c++) {
          if (1 != (T = f[c]).blend) {
            var G = T.rect,
              M = f[c - 1].rect,
              O = Math.min(G.x, M.x),
              x = Math.min(G.y, M.y),
              S = {
                x: O,
                y: x,
                width: Math.max(G.x + G.width, M.x + M.width) - O,
                height: Math.max(G.y + G.height, M.y + M.height) - x,
              };
            (f[c - 1].dispose = 1),
              c - 1 != 0 && UPNG.encode._updateFrame(e, r, t, f, c - 1, S, i),
              UPNG.encode._updateFrame(e, r, t, f, c, S, i);
          }
        }
      if (1 != e.length)
        for (var Z = 0; Z < f.length; Z++) {
          var T;
          (T = f[Z]).rect.width * T.rect.height;
        }
      return f;
    }),
    (UPNG.encode._updateFrame = function (e, r, t, a, i, s, f) {
      for (
        var c = Uint8Array,
          l = Uint32Array,
          u = new c(e[i - 1]),
          d = new l(e[i - 1]),
          h = i + 1 < e.length ? new c(e[i + 1]) : null,
          A = new c(e[i]),
          v = new l(A.buffer),
          p = r,
          m = t,
          g = -1,
          U = -1,
          w = 0;
        w < s.height;
        w++
      )
        for (var _ = 0; _ < s.width; _++) {
          var P = s.x + _,
            b = s.y + w,
            y = b * r + P,
            I = v[y];
          0 == I ||
            (0 == a[i - 1].dispose &&
              d[y] == I &&
              (null == h || 0 != h[4 * y + 3])) ||
            (P < p && (p = P),
            P > g && (g = P),
            b < m && (m = b),
            b > U && (U = b));
        }
      -1 == g && (p = m = g = U = 0),
        f && (1 == (1 & p) && p--, 1 == (1 & m) && m--),
        (s = { x: p, y: m, width: g - p + 1, height: U - m + 1 });
      var F = a[i];
      (F.rect = s),
        (F.blend = 1),
        (F.img = new Uint8Array(s.width * s.height * 4)),
        0 == a[i - 1].dispose
          ? (UPNG._copyTile(u, r, t, F.img, s.width, s.height, -s.x, -s.y, 0),
            UPNG.encode._prepareDiff(A, r, t, F.img, s))
          : UPNG._copyTile(A, r, t, F.img, s.width, s.height, -s.x, -s.y, 0);
    }),
    (UPNG.encode._prepareDiff = function (e, r, t, a, i) {
      UPNG._copyTile(e, r, t, a, i.width, i.height, -i.x, -i.y, 2);
    }),
    (UPNG.encode._filterZero = function (e, r, t, a, i, s, f) {
      var c,
        l = [],
        u = [0, 1, 2, 3, 4];
      -1 != s ? (u = [s]) : (r * a > 5e5 || 1 == t) && (u = [0]),
        f && (c = { level: 0 });
      for (var d, h = UZIP, A = 0; A < u.length; A++) {
        for (var v = 0; v < r; v++)
          UPNG.encode._filterLine(i, e, v, a, t, u[A]);
        l.push(h.deflate(i, c));
      }
      var p = 1e9;
      for (A = 0; A < l.length; A++)
        l[A].length < p && ((d = A), (p = l[A].length));
      return l[d];
    }),
    (UPNG.encode._filterLine = function (e, r, t, a, i, s) {
      var f = t * a,
        c = f + t,
        l = UPNG.decode._paeth;
      if (((e[c] = s), c++, 0 == s))
        if (a < 500) for (var u = 0; u < a; u++) e[c + u] = r[f + u];
        else e.set(new Uint8Array(r.buffer, f, a), c);
      else if (1 == s) {
        for (u = 0; u < i; u++) e[c + u] = r[f + u];
        for (u = i; u < a; u++)
          e[c + u] = (r[f + u] - r[f + u - i] + 256) & 255;
      } else if (0 == t) {
        for (u = 0; u < i; u++) e[c + u] = r[f + u];
        if (2 == s) for (u = i; u < a; u++) e[c + u] = r[f + u];
        if (3 == s)
          for (u = i; u < a; u++)
            e[c + u] = (r[f + u] - (r[f + u - i] >> 1) + 256) & 255;
        if (4 == s)
          for (u = i; u < a; u++)
            e[c + u] = (r[f + u] - l(r[f + u - i], 0, 0) + 256) & 255;
      } else {
        if (2 == s)
          for (u = 0; u < a; u++)
            e[c + u] = (r[f + u] + 256 - r[f + u - a]) & 255;
        if (3 == s) {
          for (u = 0; u < i; u++)
            e[c + u] = (r[f + u] + 256 - (r[f + u - a] >> 1)) & 255;
          for (u = i; u < a; u++)
            e[c + u] =
              (r[f + u] + 256 - ((r[f + u - a] + r[f + u - i]) >> 1)) & 255;
        }
        if (4 == s) {
          for (u = 0; u < i; u++)
            e[c + u] = (r[f + u] + 256 - l(0, r[f + u - a], 0)) & 255;
          for (u = i; u < a; u++)
            e[c + u] =
              (r[f + u] +
                256 -
                l(r[f + u - i], r[f + u - a], r[f + u - i - a])) &
              255;
        }
      }
    }),
    (UPNG.crc = {
      table: (function () {
        for (var e = new Uint32Array(256), r = 0; r < 256; r++) {
          for (var t = r, a = 0; a < 8; a++)
            1 & t ? (t = 3988292384 ^ (t >>> 1)) : (t >>>= 1);
          e[r] = t;
        }
        return e;
      })(),
      update: function update(e, r, t, a) {
        for (var i = 0; i < a; i++)
          e = UPNG.crc.table[255 & (e ^ r[t + i])] ^ (e >>> 8);
        return e;
      },
      crc: function crc(e, r, t) {
        return 4294967295 ^ UPNG.crc.update(4294967295, e, r, t);
      },
    }),
    (UPNG.quantize = function (e, r) {
      var t,
        a = new Uint8Array(e),
        i = a.slice(0),
        s = new Uint32Array(i.buffer),
        f = UPNG.quantize.getKDtree(i, r),
        c = f[0],
        l = f[1],
        u = UPNG.quantize.planeDst,
        d = a,
        h = s,
        A = d.length,
        v = new Uint8Array(a.length >> 2);
      if (a.length < 2e7)
        for (var p = 0; p < A; p += 4) {
          var m = d[p] * (1 / 255),
            g = d[p + 1] * (1 / 255),
            U = d[p + 2] * (1 / 255),
            w = d[p + 3] * (1 / 255);
          (t = UPNG.quantize.getNearest(c, m, g, U, w)),
            (v[p >> 2] = t.ind),
            (h[p >> 2] = t.est.rgba);
        }
      else
        for (p = 0; p < A; p += 4) {
          (m = d[p] * (1 / 255)),
            (g = d[p + 1] * (1 / 255)),
            (U = d[p + 2] * (1 / 255)),
            (w = d[p + 3] * (1 / 255));
          for (t = c; t.left; )
            t = u(t.est, m, g, U, w) <= 0 ? t.left : t.right;
          (v[p >> 2] = t.ind), (h[p >> 2] = t.est.rgba);
        }
      return { abuf: i.buffer, inds: v, plte: l };
    }),
    (UPNG.quantize.getKDtree = function (e, r, t) {
      null == t && (t = 1e-4);
      var a = new Uint32Array(e.buffer),
        i = {
          i0: 0,
          i1: e.length,
          bst: null,
          est: null,
          tdst: 0,
          left: null,
          right: null,
        };
      (i.bst = UPNG.quantize.stats(e, i.i0, i.i1)),
        (i.est = UPNG.quantize.estats(i.bst));
      for (var s = [i]; s.length < r; ) {
        for (var f = 0, c = 0, l = 0; l < s.length; l++)
          s[l].est.L > f && ((f = s[l].est.L), (c = l));
        if (f < t) break;
        var u = s[c],
          d = UPNG.quantize.splitPixels(
            e,
            a,
            u.i0,
            u.i1,
            u.est.e,
            u.est.eMq255
          );
        if (u.i0 >= d || u.i1 <= d) u.est.L = 0;
        else {
          var h = {
            i0: u.i0,
            i1: d,
            bst: null,
            est: null,
            tdst: 0,
            left: null,
            right: null,
          };
          (h.bst = UPNG.quantize.stats(e, h.i0, h.i1)),
            (h.est = UPNG.quantize.estats(h.bst));
          var A = {
            i0: d,
            i1: u.i1,
            bst: null,
            est: null,
            tdst: 0,
            left: null,
            right: null,
          };
          A.bst = { R: [], m: [], N: u.bst.N - h.bst.N };
          for (l = 0; l < 16; l++) A.bst.R[l] = u.bst.R[l] - h.bst.R[l];
          for (l = 0; l < 4; l++) A.bst.m[l] = u.bst.m[l] - h.bst.m[l];
          (A.est = UPNG.quantize.estats(A.bst)),
            (u.left = h),
            (u.right = A),
            (s[c] = h),
            s.push(A);
        }
      }
      s.sort(function (e, r) {
        return r.bst.N - e.bst.N;
      });
      for (l = 0; l < s.length; l++) s[l].ind = l;
      return [i, s];
    }),
    (UPNG.quantize.getNearest = function (e, r, t, a, i) {
      if (null == e.left)
        return (e.tdst = UPNG.quantize.dist(e.est.q, r, t, a, i)), e;
      var s = UPNG.quantize.planeDst(e.est, r, t, a, i),
        f = e.left,
        c = e.right;
      s > 0 && ((f = e.right), (c = e.left));
      var l = UPNG.quantize.getNearest(f, r, t, a, i);
      if (l.tdst <= s * s) return l;
      var u = UPNG.quantize.getNearest(c, r, t, a, i);
      return u.tdst < l.tdst ? u : l;
    }),
    (UPNG.quantize.planeDst = function (e, r, t, a, i) {
      var s = e.e;
      return s[0] * r + s[1] * t + s[2] * a + s[3] * i - e.eMq;
    }),
    (UPNG.quantize.dist = function (e, r, t, a, i) {
      var s = r - e[0],
        f = t - e[1],
        c = a - e[2],
        l = i - e[3];
      return s * s + f * f + c * c + l * l;
    }),
    (UPNG.quantize.splitPixels = function (e, r, t, a, i, s) {
      var f = UPNG.quantize.vecDot;
      for (a -= 4; t < a; ) {
        for (; f(e, t, i) <= s; ) t += 4;
        for (; f(e, a, i) > s; ) a -= 4;
        if (t >= a) break;
        var c = r[t >> 2];
        (r[t >> 2] = r[a >> 2]), (r[a >> 2] = c), (t += 4), (a -= 4);
      }
      for (; f(e, t, i) > s; ) t -= 4;
      return t + 4;
    }),
    (UPNG.quantize.vecDot = function (e, r, t) {
      return e[r] * t[0] + e[r + 1] * t[1] + e[r + 2] * t[2] + e[r + 3] * t[3];
    }),
    (UPNG.quantize.stats = function (e, r, t) {
      for (
        var a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          i = [0, 0, 0, 0],
          s = (t - r) >> 2,
          f = r;
        f < t;
        f += 4
      ) {
        var c = e[f] * (1 / 255),
          l = e[f + 1] * (1 / 255),
          u = e[f + 2] * (1 / 255),
          d = e[f + 3] * (1 / 255);
        (i[0] += c),
          (i[1] += l),
          (i[2] += u),
          (i[3] += d),
          (a[0] += c * c),
          (a[1] += c * l),
          (a[2] += c * u),
          (a[3] += c * d),
          (a[5] += l * l),
          (a[6] += l * u),
          (a[7] += l * d),
          (a[10] += u * u),
          (a[11] += u * d),
          (a[15] += d * d);
      }
      return (
        (a[4] = a[1]),
        (a[8] = a[2]),
        (a[9] = a[6]),
        (a[12] = a[3]),
        (a[13] = a[7]),
        (a[14] = a[11]),
        { R: a, m: i, N: s }
      );
    }),
    (UPNG.quantize.estats = function (e) {
      var r = e.R,
        t = e.m,
        a = e.N,
        i = t[0],
        s = t[1],
        f = t[2],
        c = t[3],
        l = 0 == a ? 0 : 1 / a,
        u = [
          r[0] - i * i * l,
          r[1] - i * s * l,
          r[2] - i * f * l,
          r[3] - i * c * l,
          r[4] - s * i * l,
          r[5] - s * s * l,
          r[6] - s * f * l,
          r[7] - s * c * l,
          r[8] - f * i * l,
          r[9] - f * s * l,
          r[10] - f * f * l,
          r[11] - f * c * l,
          r[12] - c * i * l,
          r[13] - c * s * l,
          r[14] - c * f * l,
          r[15] - c * c * l,
        ],
        d = u,
        h = UPNG.M4,
        A = [Math.random(), Math.random(), Math.random(), Math.random()],
        v = 0,
        p = 0;
      if (0 != a)
        for (
          var m = 0;
          m < 16 &&
          ((A = h.multVec(d, A)),
          (p = Math.sqrt(h.dot(A, A))),
          (A = h.sml(1 / p, A)),
          !(0 != m && Math.abs(p - v) < 1e-9));
          m++
        )
          v = p;
      var g = [i * l, s * l, f * l, c * l];
      return {
        Cov: u,
        q: g,
        e: A,
        L: v,
        eMq255: h.dot(h.sml(255, g), A),
        eMq: h.dot(A, g),
        rgba:
          ((Math.round(255 * g[3]) << 24) |
            (Math.round(255 * g[2]) << 16) |
            (Math.round(255 * g[1]) << 8) |
            (Math.round(255 * g[0]) << 0)) >>>
          0,
      };
    }),
    (UPNG.M4 = {
      multVec: function multVec(e, r) {
        return [
          e[0] * r[0] + e[1] * r[1] + e[2] * r[2] + e[3] * r[3],
          e[4] * r[0] + e[5] * r[1] + e[6] * r[2] + e[7] * r[3],
          e[8] * r[0] + e[9] * r[1] + e[10] * r[2] + e[11] * r[3],
          e[12] * r[0] + e[13] * r[1] + e[14] * r[2] + e[15] * r[3],
        ];
      },
      dot: function dot(e, r) {
        return e[0] * r[0] + e[1] * r[1] + e[2] * r[2] + e[3] * r[3];
      },
      sml: function sml(e, r) {
        return [e * r[0], e * r[1], e * r[2], e * r[3]];
      },
    }),
    (UPNG.encode.concatRGBA = function (e) {
      for (var r = 0, t = 0; t < e.length; t++) r += e[t].byteLength;
      var a = new Uint8Array(r),
        i = 0;
      for (t = 0; t < e.length; t++) {
        for (var s = new Uint8Array(e[t]), f = s.length, c = 0; c < f; c += 4) {
          var l = s[c],
            u = s[c + 1],
            d = s[c + 2],
            h = s[c + 3];
          0 == h && (l = u = d = 0),
            (a[i + c] = l),
            (a[i + c + 1] = u),
            (a[i + c + 2] = d),
            (a[i + c + 3] = h);
        }
        i += f;
      }
      return a.buffer;
    });
  var BROWSER_NAME = {
      CHROME: "CHROME",
      FIREFOX: "FIREFOX",
      DESKTOP_SAFARI: "DESKTOP_SAFARI",
      IE: "IE",
      MOBILE_SAFARI: "MOBILE_SAFARI",
      ETC: "ETC",
    },
    _BROWSER_NAME$CHROME$,
    MAX_CANVAS_SIZE =
      ((_BROWSER_NAME$CHROME$ = {}),
      _defineProperty(_BROWSER_NAME$CHROME$, BROWSER_NAME.CHROME, 16384),
      _defineProperty(_BROWSER_NAME$CHROME$, BROWSER_NAME.FIREFOX, 11180),
      _defineProperty(
        _BROWSER_NAME$CHROME$,
        BROWSER_NAME.DESKTOP_SAFARI,
        16384
      ),
      _defineProperty(_BROWSER_NAME$CHROME$, BROWSER_NAME.IE, 8192),
      _defineProperty(_BROWSER_NAME$CHROME$, BROWSER_NAME.MOBILE_SAFARI, 4096),
      _defineProperty(_BROWSER_NAME$CHROME$, BROWSER_NAME.ETC, 8192),
      _BROWSER_NAME$CHROME$),
    isBrowser = "undefined" != typeof window,
    moduleMapper =
      isBrowser &&
      window.cordova &&
      window.cordova.require &&
      window.cordova.require("cordova/modulemapper"),
    CustomFile =
      isBrowser &&
      ((moduleMapper && moduleMapper.getOriginalSymbol(window, "File")) ||
        (void 0 !== window.File && File)),
    CustomFileReader =
      isBrowser &&
      ((moduleMapper && moduleMapper.getOriginalSymbol(window, "FileReader")) ||
        (void 0 !== window.FileReader && FileReader));
  function getFilefromDataUrl(e, r) {
    var t =
      arguments.length > 2 && void 0 !== arguments[2]
        ? arguments[2]
        : Date.now();
    return new Promise(function (a) {
      for (
        var i = e.split(","),
          s = i[0].match(/:(.*?);/)[1],
          f = globalThis.atob(i[1]),
          c = f.length,
          l = new Uint8Array(c);
        c--;

      )
        l[c] = f.charCodeAt(c);
      var u = new Blob([l], { type: s });
      (u.name = r), (u.lastModified = t), a(u);
    });
  }
  function getDataUrlFromFile(e) {
    return new Promise(function (r, t) {
      var a = new CustomFileReader();
      (a.onload = function () {
        return r(a.result);
      }),
        (a.onerror = function (e) {
          return t(e);
        }),
        a.readAsDataURL(e);
    });
  }
  function loadImage(e) {
    return new Promise(function (r, t) {
      var a = new Image();
      (a.onload = function () {
        return r(a);
      }),
        (a.onerror = function (e) {
          return t(e);
        }),
        (a.src = e);
    });
  }
  function getBrowserName() {
    if (void 0 !== getBrowserName.cachedResult)
      return getBrowserName.cachedResult;
    var e = BROWSER_NAME.ETC,
      r = navigator.userAgent;
    return (
      /Chrom(e|ium)/i.test(r)
        ? (e = BROWSER_NAME.CHROME)
        : /iP(ad|od|hone)/i.test(r) &&
          /WebKit/i.test(r) &&
          !/(CriOS|FxiOS|OPiOS|mercury)/i.test(r)
        ? (e = BROWSER_NAME.MOBILE_SAFARI)
        : /Safari/i.test(r)
        ? (e = BROWSER_NAME.DESKTOP_SAFARI)
        : /Firefox/i.test(r)
        ? (e = BROWSER_NAME.FIREFOX)
        : (/MSIE/i.test(r) || !0 == !!document.documentMode) &&
          (e = BROWSER_NAME.IE),
      (getBrowserName.cachedResult = e),
      getBrowserName.cachedResult
    );
  }
  function approximateBelowMaximumCanvasSizeOfBrowser(e, r) {
    for (
      var t = getBrowserName(),
        a = MAX_CANVAS_SIZE[t],
        i = e,
        s = r,
        f = i * s,
        c = i > s ? s / i : i / s;
      f > a * a;

    ) {
      var l = (a + i) / 2,
        u = (a + s) / 2;
      l < u ? ((s = u), (i = u * c)) : ((s = l * c), (i = l)), (f = i * s);
    }
    return { width: i, height: s };
  }
  function getNewCanvasAndCtx(e, r) {
    var t, a;
    try {
      if (null === (a = (t = new OffscreenCanvas(e, r)).getContext("2d")))
        throw new Error("getContext of OffscreenCanvas returns null");
    } catch (e) {
      a = (t = document.createElement("canvas")).getContext("2d");
    }
    return (t.width = e), (t.height = r), [t, a];
  }
  function drawImageInCanvas(e) {
    var r =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0,
      t = approximateBelowMaximumCanvasSizeOfBrowser(e.width, e.height),
      a = t.width,
      i = t.height,
      s = getNewCanvasAndCtx(a, i),
      f = _slicedToArray(s, 2),
      c = f[0],
      l = f[1];
    return (
      r &&
        /jpe?g/.test(r) &&
        ((l.fillStyle = "white"), l.fillRect(0, 0, c.width, c.height)),
      l.drawImage(e, 0, 0, c.width, c.height),
      c
    );
  }
  function isIOS() {
    return (
      void 0 !== isIOS.cachedResult ||
        (isIOS.cachedResult =
          [
            "iPad Simulator",
            "iPhone Simulator",
            "iPod Simulator",
            "iPad",
            "iPhone",
            "iPod",
          ].includes(navigator.platform) ||
          (navigator.userAgent.includes("Mac") &&
            "undefined" != typeof document &&
            "ontouchend" in document)),
      isIOS.cachedResult
    );
  }
  function drawFileInCanvas(e) {
    var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    return new Promise(function (t, a) {
      var i,
        s,
        f = function $Try_2_Post() {
          try {
            return (s = drawImageInCanvas(i, r.fileType || e.type)), t([i, s]);
          } catch (e) {
            return a(e);
          }
        },
        c = function $Try_2_Catch(r) {
          try {
            0;
            var t = function $Try_3_Catch(e) {
              try {
                throw e;
              } catch (e) {
                return a(e);
              }
            };
            try {
              return getDataUrlFromFile(e).then(function (e) {
                try {
                  return loadImage(e).then(function (e) {
                    try {
                      return (
                        (i = e),
                        (function $Try_3_Post() {
                          try {
                            return f();
                          } catch (e) {
                            return a(e);
                          }
                        })()
                      );
                    } catch (e) {
                      return t(e);
                    }
                  }, t);
                } catch (e) {
                  return t(e);
                }
              }, t);
            } catch (e) {
              t(e);
            }
          } catch (e) {
            return a(e);
          }
        };
      try {
        if (
          isIOS() ||
          [BROWSER_NAME.DESKTOP_SAFARI, BROWSER_NAME.MOBILE_SAFARI].includes(
            getBrowserName()
          )
        )
          throw new Error("Skip createImageBitmap on IOS and Safari");
        return createImageBitmap(e).then(function (e) {
          try {
            return (i = e), f();
          } catch (e) {
            return c();
          }
        }, c);
      } catch (e) {
        c();
      }
    });
  }
  function canvasToFile(e, r, t, a) {
    var i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1;
    return new Promise(function (s, f) {
      var c, l, u;
      if ("image/png" === r)
        return (
          (l = e.getContext("2d").getImageData(0, 0, e.width, e.height).data),
          (u = UPNG.encode([l], e.width, e.height, 256 * i)),
          ((c = new Blob([u], { type: r })).name = t),
          (c.lastModified = a),
          $If_4.call(this)
        );
      {
        return "function" == typeof OffscreenCanvas &&
          e instanceof OffscreenCanvas
          ? e.convertToBlob({ type: r, quality: i }).then(
              function (e) {
                try {
                  return (
                    ((c = e).name = t), (c.lastModified = a), $If_5.call(this)
                  );
                } catch (e) {
                  return f(e);
                }
              }.bind(this),
              f
            )
          : getFilefromDataUrl(e.toDataURL(r, i), t, a).then(
              function (e) {
                try {
                  return (c = e), $If_5.call(this);
                } catch (e) {
                  return f(e);
                }
              }.bind(this),
              f
            );
        function $If_5() {
          return $If_4.call(this);
        }
      }
      function $If_4() {
        return s(c);
      }
    });
  }
  function cleanupCanvasMemory(e) {
    (e.width = 0), (e.height = 0);
  }
  function isAutoOrientationInBrowser() {
    return new Promise(function (e, r) {
      var t, a, i, s;
      return void 0 !== isAutoOrientationInBrowser.cachedResult
        ? e(isAutoOrientationInBrowser.cachedResult)
        : ("data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==",
          getFilefromDataUrl(
            "data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAAAAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/xABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==",
            "test.jpg",
            Date.now()
          ).then(function (f) {
            try {
              return drawFileInCanvas((t = f)).then(function (f) {
                try {
                  return canvasToFile(
                    (a = f[1]),
                    t.type,
                    t.name,
                    t.lastModified
                  ).then(function (t) {
                    try {
                      return (
                        (i = t),
                        cleanupCanvasMemory(a),
                        drawFileInCanvas(i).then(function (t) {
                          try {
                            return (
                              (s = t[0]),
                              (isAutoOrientationInBrowser.cachedResult =
                                1 === s.width && 2 === s.height),
                              e(isAutoOrientationInBrowser.cachedResult)
                            );
                          } catch (e) {
                            return r(e);
                          }
                        }, r)
                      );
                    } catch (e) {
                      return r(e);
                    }
                  }, r);
                } catch (e) {
                  return r(e);
                }
              }, r);
            } catch (e) {
              return r(e);
            }
          }, r));
    });
  }
  function getExifOrientation(e) {
    return new Promise(function (r, t) {
      var a = new CustomFileReader();
      (a.onload = function (e) {
        var t = new DataView(e.target.result);
        if (65496 != t.getUint16(0, !1)) return r(-2);
        for (var a = t.byteLength, i = 2; i < a; ) {
          if (t.getUint16(i + 2, !1) <= 8) return r(-1);
          var s = t.getUint16(i, !1);
          if (((i += 2), 65505 == s)) {
            if (1165519206 != t.getUint32((i += 2), !1)) return r(-1);
            var f = 18761 == t.getUint16((i += 6), !1);
            i += t.getUint32(i + 4, f);
            var c = t.getUint16(i, f);
            i += 2;
            for (var l = 0; l < c; l++)
              if (274 == t.getUint16(i + 12 * l, f))
                return r(t.getUint16(i + 12 * l + 8, f));
          } else {
            if (65280 != (65280 & s)) break;
            i += t.getUint16(i, !1);
          }
        }
        return r(-1);
      }),
        (a.onerror = function (e) {
          return t(e);
        }),
        a.readAsArrayBuffer(e);
    });
  }
  function handleMaxWidthOrHeight(e, r) {
    var t,
      a = e.width,
      i = e.height,
      s = r.maxWidthOrHeight,
      f = e;
    if (isFinite(s) && (a > s || i > s)) {
      var c = _slicedToArray(getNewCanvasAndCtx(a, i), 2);
      (f = c[0]),
        (t = c[1]),
        a > i
          ? ((f.width = s), (f.height = (i / a) * s))
          : ((f.width = (a / i) * s), (f.height = s)),
        t.drawImage(e, 0, 0, f.width, f.height),
        cleanupCanvasMemory(e);
    }
    return f;
  }
  function followExifOrientation(e, r) {
    var t = e.width,
      a = e.height,
      i = _slicedToArray(getNewCanvasAndCtx(t, a), 2),
      s = i[0],
      f = i[1];
    switch (
      (r > 4 && r < 9
        ? ((s.width = a), (s.height = t))
        : ((s.width = t), (s.height = a)),
      r)
    ) {
      case 2:
        f.transform(-1, 0, 0, 1, t, 0);
        break;
      case 3:
        f.transform(-1, 0, 0, -1, t, a);
        break;
      case 4:
        f.transform(1, 0, 0, -1, 0, a);
        break;
      case 5:
        f.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        f.transform(0, 1, -1, 0, a, 0);
        break;
      case 7:
        f.transform(0, -1, -1, 0, a, t);
        break;
      case 8:
        f.transform(0, -1, 1, 0, 0, t);
    }
    return f.drawImage(e, 0, 0, t, a), cleanupCanvasMemory(e), s;
  }
  function compress(e, r) {
    var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
    return new Promise(function (a, i) {
      var s, f, c, l, u, d, h, A, v, p, m, g, U, w, _, P, b, y, I;
      function incProgress() {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 5;
        if (r.signal && r.signal.aborted) throw r.signal.reason;
        (s += e), r.onProgress(Math.min(s, 100));
      }
      function setProgress(e) {
        if (r.signal && r.signal.aborted) throw r.signal.reason;
        (s = Math.min(Math.max(e, s), 100)), r.onProgress(s);
      }
      return (
        (s = t),
        (f = r.maxIteration || 10),
        (c = 1024 * r.maxSizeMB * 1024),
        incProgress(),
        drawFileInCanvas(e, r).then(
          function (t) {
            try {
              var s = _slicedToArray(t, 2);
              return (
                (l = s[1]),
                incProgress(),
                (u = handleMaxWidthOrHeight(l, r)),
                incProgress(),
                new Promise(function (t, a) {
                  var i;
                  if (!(i = r.exifOrientation))
                    return getExifOrientation(e).then(
                      function (e) {
                        try {
                          return (i = e), $If_2.call(this);
                        } catch (e) {
                          return a(e);
                        }
                      }.bind(this),
                      a
                    );
                  function $If_2() {
                    return t(i);
                  }
                  return $If_2.call(this);
                }).then(
                  function (t) {
                    try {
                      return (
                        (d = t),
                        incProgress(),
                        isAutoOrientationInBrowser().then(
                          function (t) {
                            try {
                              return (
                                (h = t ? u : followExifOrientation(u, d)),
                                incProgress(),
                                (A = r.initialQuality || 1),
                                (v = r.fileType || e.type),
                                canvasToFile(
                                  h,
                                  v,
                                  e.name,
                                  e.lastModified,
                                  A
                                ).then(
                                  function (t) {
                                    try {
                                      {
                                        if (
                                          ((p = t),
                                          incProgress(),
                                          (m = p.size > c),
                                          (g = p.size > e.size),
                                          !m && !g)
                                        )
                                          return setProgress(100), a(p);
                                        var s;
                                        function $Loop_3() {
                                          if (f-- && (_ > c || _ > U)) {
                                            var r,
                                              t,
                                              a = _slicedToArray(
                                                getNewCanvasAndCtx(
                                                  (r = I
                                                    ? 0.95 * y.width
                                                    : y.width),
                                                  (t = I
                                                    ? 0.95 * y.height
                                                    : y.height)
                                                ),
                                                2
                                              );
                                            return (
                                              (b = a[0]),
                                              a[1].drawImage(y, 0, 0, r, t),
                                              (A *= 0.95),
                                              canvasToFile(
                                                b,
                                                v,
                                                e.name,
                                                e.lastModified,
                                                A
                                              ).then(function (e) {
                                                try {
                                                  return (
                                                    (P = e),
                                                    cleanupCanvasMemory(y),
                                                    (y = b),
                                                    (_ = P.size),
                                                    setProgress(
                                                      Math.min(
                                                        99,
                                                        Math.floor(
                                                          ((w - _) / (w - c)) *
                                                            100
                                                        )
                                                      )
                                                    ),
                                                    $Loop_3
                                                  );
                                                } catch (e) {
                                                  return i(e);
                                                }
                                              }, i)
                                            );
                                          }
                                          return [1];
                                        }
                                        return (
                                          (U = e.size),
                                          (w = p.size),
                                          (_ = w),
                                          (y = h),
                                          (I = !r.alwaysKeepResolution && m),
                                          (s = function (e) {
                                            for (; e; ) {
                                              if (e.then)
                                                return void e.then(s, i);
                                              try {
                                                if (e.pop) {
                                                  if (e.length)
                                                    return e.pop()
                                                      ? $Loop_3_exit.call(this)
                                                      : e;
                                                  e = $Loop_3;
                                                } else e = e.call(this);
                                              } catch (e) {
                                                return i(e);
                                              }
                                            }
                                          }.bind(this))($Loop_3)
                                        );
                                        function $Loop_3_exit() {
                                          return (
                                            cleanupCanvasMemory(y),
                                            cleanupCanvasMemory(b),
                                            cleanupCanvasMemory(u),
                                            cleanupCanvasMemory(h),
                                            cleanupCanvasMemory(l),
                                            setProgress(100),
                                            a(P)
                                          );
                                        }
                                      }
                                    } catch (e) {
                                      return i(e);
                                    }
                                  }.bind(this),
                                  i
                                )
                              );
                            } catch (e) {
                              return i(e);
                            }
                          }.bind(this),
                          i
                        )
                      );
                    } catch (e) {
                      return i(e);
                    }
                  }.bind(this),
                  i
                )
              );
            } catch (e) {
              return i(e);
            }
          }.bind(this),
          i
        )
      );
    });
  }
  var cnt = 0,
    imageCompressionLibUrl,
    worker;
  function createWorker(e) {
    var r = [];
    return (
      "function" == typeof e ? r.push("(".concat(e, ")()")) : r.push(e),
      new Worker(URL.createObjectURL(new Blob(r)))
    );
  }
  function createSourceObject(e) {
    return URL.createObjectURL(
      new Blob([e], { type: "application/javascript" })
    );
  }
  function stringify(e) {
    return JSON.stringify(e, function (e, r) {
      return "function" == typeof r
        ? "BIC_FN:::(function () { return ".concat(r.toString(), " })()")
        : r;
    });
  }
  function parse(o) {
    if ("string" == typeof o) return o;
    var result = {};
    return (
      Object.entries(o).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        if ("string" == typeof value && value.startsWith("BIC_FN:::"))
          try {
            result[key] = eval(value.replace(/^BIC_FN:::/, ""));
          } catch (e) {
            throw e;
          }
        else result[key] = parse(value);
      }),
      result
    );
  }
  function generateLib() {
    return createSourceObject(
      "\n    // reconstruct library\n    function imageCompression (){return ("
        .concat(
          imageCompression,
          ").apply(null, arguments)}\n\n    imageCompression.getDataUrlFromFile = "
        )
        .concat(
          imageCompression.getDataUrlFromFile,
          "\n    imageCompression.getFilefromDataUrl = "
        )
        .concat(
          imageCompression.getFilefromDataUrl,
          "\n    imageCompression.loadImage = "
        )
        .concat(
          imageCompression.loadImage,
          "\n    imageCompression.drawImageInCanvas = "
        )
        .concat(
          imageCompression.drawImageInCanvas,
          "\n    imageCompression.drawFileInCanvas = "
        )
        .concat(
          imageCompression.drawFileInCanvas,
          "\n    imageCompression.canvasToFile = "
        )
        .concat(
          imageCompression.canvasToFile,
          "\n    imageCompression.getExifOrientation = "
        )
        .concat(
          imageCompression.getExifOrientation,
          "\n    imageCompression.handleMaxWidthOrHeight = "
        )
        .concat(
          imageCompression.handleMaxWidthOrHeight,
          "\n    imageCompression.followExifOrientation = "
        )
        .concat(
          imageCompression.followExifOrientation,
          "\n    imageCompression.cleanupCanvasMemory = "
        )
        .concat(
          imageCompression.cleanupCanvasMemory,
          "\n    imageCompression.isAutoOrientationInBrowser = "
        )
        .concat(
          imageCompression.isAutoOrientationInBrowser,
          "\n    imageCompression.approximateBelowMaximumCanvasSizeOfBrowser = "
        )
        .concat(
          imageCompression.approximateBelowMaximumCanvasSizeOfBrowser,
          "\n    imageCompression.getBrowserName = "
        )
        .concat(
          imageCompression.getBrowserName,
          "\n\n    // functions / objects\n    getDataUrlFromFile = imageCompression.getDataUrlFromFile\n    getFilefromDataUrl = imageCompression.getFilefromDataUrl\n    loadImage = imageCompression.loadImage\n    drawImageInCanvas = imageCompression.drawImageInCanvas\n    drawFileInCanvas = imageCompression.drawFileInCanvas\n    canvasToFile = imageCompression.canvasToFile\n    getExifOrientation = imageCompression.getExifOrientation\n    handleMaxWidthOrHeight = imageCompression.handleMaxWidthOrHeight\n    followExifOrientation = imageCompression.followExifOrientation\n    cleanupCanvasMemory = imageCompression.cleanupCanvasMemory\n    isAutoOrientationInBrowser = imageCompression.isAutoOrientationInBrowser\n    approximateBelowMaximumCanvasSizeOfBrowser = imageCompression.approximateBelowMaximumCanvasSizeOfBrowser\n    getBrowserName = imageCompression.getBrowserName\n    isIOS = "
        )
        .concat(isIOS, "\n    \n    getNewCanvasAndCtx = ")
        .concat(
          getNewCanvasAndCtx,
          "\n    CustomFileReader = FileReader\n    CustomFile = File\n    MAX_CANVAS_SIZE = "
        )
        .concat(JSON.stringify(MAX_CANVAS_SIZE), "\n    BROWSER_NAME = ")
        .concat(
          JSON.stringify(BROWSER_NAME),
          "\n    function compress (){return ("
        )
        .concat(
          compress,
          ").apply(null, arguments)}\n\n    // core-js\n    function _slicedToArray(arr, n) { return arr }\n    function _typeof(a) { return typeof a }\n    function _objectSpread2(target) {\n      for (var i = 1; i < arguments.length; i++) {\n        var source = arguments[i] != null ? arguments[i] : {};\n  \n        Object.assign(target, source)\n      }\n  \n      return target;\n    }\n\n    // Libraries\n    const parse = "
        )
        .concat(parse, "\n    const UPNG = {}\n    UPNG.toRGBA8 = ")
        .concat(UPNG.toRGBA8, "\n    UPNG.toRGBA8.decodeImage = ")
        .concat(UPNG.toRGBA8.decodeImage, "\n    UPNG.decode = ")
        .concat(UPNG.decode, "\n    UPNG.decode._decompress = ")
        .concat(UPNG.decode._decompress, "\n    UPNG.decode._inflate = ")
        .concat(UPNG.decode._inflate, "\n    UPNG.decode._readInterlace = ")
        .concat(UPNG.decode._readInterlace, "\n    UPNG.decode._getBPP = ")
        .concat(UPNG.decode._getBPP, " \n    UPNG.decode._filterZero = ")
        .concat(UPNG.decode._filterZero, "\n    UPNG.decode._paeth = ")
        .concat(UPNG.decode._paeth, "\n    UPNG.decode._IHDR = ")
        .concat(UPNG.decode._IHDR, "\n    UPNG._bin = parse(")
        .concat(stringify(UPNG._bin), ")\n    UPNG._copyTile = ")
        .concat(UPNG._copyTile, "\n    UPNG.encode = ")
        .concat(UPNG.encode, "\n    UPNG.encodeLL = ")
        .concat(UPNG.encodeLL, " \n    UPNG.encode._main = ")
        .concat(UPNG.encode._main, "\n    UPNG.encode.compressPNG = ")
        .concat(UPNG.encode.compressPNG, " \n    UPNG.encode.compress = ")
        .concat(UPNG.encode.compress, "\n    UPNG.encode.framize = ")
        .concat(UPNG.encode.framize, " \n    UPNG.encode._updateFrame = ")
        .concat(UPNG.encode._updateFrame, " \n    UPNG.encode._prepareDiff = ")
        .concat(UPNG.encode._prepareDiff, " \n    UPNG.encode._filterZero = ")
        .concat(UPNG.encode._filterZero, " \n    UPNG.encode._filterLine = ")
        .concat(UPNG.encode._filterLine, "\n    UPNG.encode.concatRGBA = ")
        .concat(UPNG.encode.concatRGBA, "\n    UPNG.crc = parse(")
        .concat(
          stringify(UPNG.crc),
          ")\n    UPNG.crc.table = ( function() {\n    var tab = new Uint32Array(256);\n    for (var n=0; n<256; n++) {\n      var c = n;\n      for (var k=0; k<8; k++) {\n        if (c & 1)  c = 0xedb88320 ^ (c >>> 1);\n        else        c = c >>> 1;\n      }\n      tab[n] = c;  }\n    return tab;  })()\n    UPNG.quantize = "
        )
        .concat(UPNG.quantize, " \n    UPNG.quantize.getKDtree = ")
        .concat(UPNG.quantize.getKDtree, " \n    UPNG.quantize.getNearest = ")
        .concat(UPNG.quantize.getNearest, " \n    UPNG.quantize.planeDst = ")
        .concat(UPNG.quantize.planeDst, " \n    UPNG.quantize.dist = ")
        .concat(UPNG.quantize.dist, "     \n    UPNG.quantize.splitPixels = ")
        .concat(UPNG.quantize.splitPixels, " \n    UPNG.quantize.vecDot = ")
        .concat(UPNG.quantize.vecDot, " \n    UPNG.quantize.stats = ")
        .concat(UPNG.quantize.stats, " \n    UPNG.quantize.estats = ")
        .concat(UPNG.quantize.estats, "\n    UPNG.M4 = parse(")
        .concat(stringify(UPNG.M4), ")\n    UPNG.encode.concatRGBA = ")
        .concat(
          UPNG.encode.concatRGBA,
          '\n    UPNG.inflateRaw=function(){\n    var H={};H.H={};H.H.N=function(N,W){var R=Uint8Array,i=0,m=0,J=0,h=0,Q=0,X=0,u=0,w=0,d=0,v,C;\n      if(N[0]==3&&N[1]==0)return W?W:new R(0);var V=H.H,n=V.b,A=V.e,l=V.R,M=V.n,I=V.A,e=V.Z,b=V.m,Z=W==null;\n      if(Z)W=new R(N.length>>>2<<5);while(i==0){i=n(N,d,1);m=n(N,d+1,2);d+=3;if(m==0){if((d&7)!=0)d+=8-(d&7);\n        var D=(d>>>3)+4,q=N[D-4]|N[D-3]<<8;if(Z)W=H.H.W(W,w+q);W.set(new R(N.buffer,N.byteOffset+D,q),w);d=D+q<<3;\n        w+=q;continue}if(Z)W=H.H.W(W,w+(1<<17));if(m==1){v=b.J;C=b.h;X=(1<<9)-1;u=(1<<5)-1}if(m==2){J=A(N,d,5)+257;\n        h=A(N,d+5,5)+1;Q=A(N,d+10,4)+4;d+=14;var E=d,j=1;for(var c=0;c<38;c+=2){b.Q[c]=0;b.Q[c+1]=0}for(var c=0;\n                                                                                                        c<Q;c++){var K=A(N,d+c*3,3);b.Q[(b.X[c]<<1)+1]=K;if(K>j)j=K}d+=3*Q;M(b.Q,j);I(b.Q,j,b.u);v=b.w;C=b.d;\n        d=l(b.u,(1<<j)-1,J+h,N,d,b.v);var r=V.V(b.v,0,J,b.C);X=(1<<r)-1;var S=V.V(b.v,J,h,b.D);u=(1<<S)-1;M(b.C,r);\n        I(b.C,r,v);M(b.D,S);I(b.D,S,C)}while(!0){var T=v[e(N,d)&X];d+=T&15;var p=T>>>4;if(p>>>8==0){W[w++]=p}else if(p==256){break}else{var z=w+p-254;\n        if(p>264){var _=b.q[p-257];z=w+(_>>>3)+A(N,d,_&7);d+=_&7}var $=C[e(N,d)&u];d+=$&15;var s=$>>>4,Y=b.c[s],a=(Y>>>4)+n(N,d,Y&15);\n        d+=Y&15;while(w<z){W[w]=W[w++-a];W[w]=W[w++-a];W[w]=W[w++-a];W[w]=W[w++-a]}w=z}}}return W.length==w?W:W.slice(0,w)};\n      H.H.W=function(N,W){var R=N.length;if(W<=R)return N;var V=new Uint8Array(R<<1);V.set(N,0);return V};\n      H.H.R=function(N,W,R,V,n,A){var l=H.H.e,M=H.H.Z,I=0;while(I<R){var e=N[M(V,n)&W];n+=e&15;var b=e>>>4;\n        if(b<=15){A[I]=b;I++}else{var Z=0,m=0;if(b==16){m=3+l(V,n,2);n+=2;Z=A[I-1]}else if(b==17){m=3+l(V,n,3);\n          n+=3}else if(b==18){m=11+l(V,n,7);n+=7}var J=I+m;while(I<J){A[I]=Z;I++}}}return n};H.H.V=function(N,W,R,V){var n=0,A=0,l=V.length>>>1;\n        while(A<R){var M=N[A+W];V[A<<1]=0;V[(A<<1)+1]=M;if(M>n)n=M;A++}while(A<l){V[A<<1]=0;V[(A<<1)+1]=0;A++}return n};\n      H.H.n=function(N,W){var R=H.H.m,V=N.length,n,A,l,M,I,e=R.j;for(var M=0;M<=W;M++)e[M]=0;for(M=1;M<V;M+=2)e[N[M]]++;\n        var b=R.K;n=0;e[0]=0;for(A=1;A<=W;A++){n=n+e[A-1]<<1;b[A]=n}for(l=0;l<V;l+=2){I=N[l+1];if(I!=0){N[l]=b[I];\n          b[I]++}}};H.H.A=function(N,W,R){var V=N.length,n=H.H.m,A=n.r;for(var l=0;l<V;l+=2)if(N[l+1]!=0){var M=l>>1,I=N[l+1],e=M<<4|I,b=W-I,Z=N[l]<<b,m=Z+(1<<b);\n        while(Z!=m){var J=A[Z]>>>15-W;R[J]=e;Z++}}};H.H.l=function(N,W){var R=H.H.m.r,V=15-W;for(var n=0;n<N.length;\n                                                                                                 n+=2){var A=N[n]<<W-N[n+1];N[n]=R[A]>>>V}};H.H.M=function(N,W,R){R=R<<(W&7);var V=W>>>3;N[V]|=R;N[V+1]|=R>>>8};\n      H.H.I=function(N,W,R){R=R<<(W&7);var V=W>>>3;N[V]|=R;N[V+1]|=R>>>8;N[V+2]|=R>>>16};H.H.e=function(N,W,R){return(N[W>>>3]|N[(W>>>3)+1]<<8)>>>(W&7)&(1<<R)-1};\n      H.H.b=function(N,W,R){return(N[W>>>3]|N[(W>>>3)+1]<<8|N[(W>>>3)+2]<<16)>>>(W&7)&(1<<R)-1};H.H.Z=function(N,W){return(N[W>>>3]|N[(W>>>3)+1]<<8|N[(W>>>3)+2]<<16)>>>(W&7)};\n      H.H.i=function(N,W){return(N[W>>>3]|N[(W>>>3)+1]<<8|N[(W>>>3)+2]<<16|N[(W>>>3)+3]<<24)>>>(W&7)};H.H.m=function(){var N=Uint16Array,W=Uint32Array;\n        return{K:new N(16),j:new N(16),X:[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],S:[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],T:[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0],q:new N(32),p:[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,65535,65535],z:[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],c:new W(32),J:new N(512),_:[],h:new N(32),$:[],w:new N(32768),C:[],v:[],d:new N(32768),D:[],u:new N(512),Q:[],r:new N(1<<15),s:new W(286),Y:new W(30),a:new W(19),t:new W(15e3),k:new N(1<<16),g:new N(1<<15)}}();\n      (function(){var N=H.H.m,W=1<<15;for(var R=0;R<W;R++){var V=R;V=(V&2863311530)>>>1|(V&1431655765)<<1;\n        V=(V&3435973836)>>>2|(V&858993459)<<2;V=(V&4042322160)>>>4|(V&252645135)<<4;V=(V&4278255360)>>>8|(V&16711935)<<8;\n        N.r[R]=(V>>>16|V<<16)>>>17}function n(A,l,M){while(l--!=0)A.push(0,M)}for(var R=0;R<32;R++){N.q[R]=N.S[R]<<3|N.T[R];\n        N.c[R]=N.p[R]<<4|N.z[R]}n(N._,144,8);n(N._,255-143,9);n(N._,279-255,7);n(N._,287-279,8);H.H.n(N._,9);\n        H.H.A(N._,9,N.J);H.H.l(N._,9);n(N.$,32,5);H.H.n(N.$,5);H.H.A(N.$,5,N.h);H.H.l(N.$,5);n(N.Q,19,0);n(N.C,286,0);\n        n(N.D,30,0);n(N.v,320,0)}());return H.H.N}()\n    \n    const UZIP = {}\n    UZIP["parse"] = '
        )
        .concat(UZIP_1.parse, "\n    UZIP._readLocal = ")
        .concat(UZIP_1._readLocal, "\n    UZIP.inflateRaw = ")
        .concat(UZIP_1.inflateRaw, "\n    UZIP.inflate = ")
        .concat(UZIP_1.inflate, "\n    UZIP.deflate = ")
        .concat(UZIP_1.deflate, "\n    UZIP.deflateRaw = ")
        .concat(UZIP_1.deflateRaw, "\n    UZIP.encode = ")
        .concat(UZIP_1.encode, "\n    UZIP._noNeed = ")
        .concat(UZIP_1._noNeed, "\n    UZIP._writeHeader = ")
        .concat(UZIP_1._writeHeader, "\n    UZIP.crc = parse(")
        .concat(
          stringify(UZIP_1.crc),
          ")\n    UZIP.crc.table = ( function() {\n      var tab = new Uint32Array(256);\n      for (var n=0; n<256; n++) {\n        var c = n;\n        for (var k=0; k<8; k++) {\n          if (c & 1)  c = 0xedb88320 ^ (c >>> 1);\n          else        c = c >>> 1;\n        }\n        tab[n] = c;  }\n      return tab;  })()\n    \n    UZIP.adler = "
        )
        .concat(UZIP_1.adler, "\n    UZIP.bin = parse(")
        .concat(
          stringify(UZIP_1.bin),
          ")\n    UZIP.F = {}\n    UZIP.F.deflateRaw = "
        )
        .concat(UZIP_1.F.deflateRaw, "\n    UZIP.F._bestMatch = ")
        .concat(UZIP_1.F._bestMatch, "\n    UZIP.F._howLong = ")
        .concat(UZIP_1.F._howLong, "\n    UZIP.F._hash = ")
        .concat(UZIP_1.F._hash, "\n    UZIP.saved = ")
        .concat(UZIP_1.saved, "\n    UZIP.F._writeBlock = ")
        .concat(UZIP_1.F._writeBlock, "\n    UZIP.F._copyExact = ")
        .concat(UZIP_1.F._copyExact, "\n    UZIP.F.getTrees = ")
        .concat(UZIP_1.F.getTrees, "\n    UZIP.F.getSecond = ")
        .concat(UZIP_1.F.getSecond, "\n    UZIP.F.nonZero = ")
        .concat(UZIP_1.F.nonZero, "\n    UZIP.F.contSize = ")
        .concat(UZIP_1.F.contSize, "\n    UZIP.F._codeTiny = ")
        .concat(UZIP_1.F._codeTiny, " \n    UZIP.F._lenCodes = ")
        .concat(UZIP_1.F._lenCodes, " \n    UZIP.F._hufTree = ")
        .concat(UZIP_1.F._hufTree, " \n    UZIP.F.setDepth = ")
        .concat(UZIP_1.F.setDepth, " \n    UZIP.F.restrictDepth = ")
        .concat(UZIP_1.F.restrictDepth, "\n    UZIP.F._goodIndex = ")
        .concat(UZIP_1.F._goodIndex, " \n    UZIP.F._writeLit = ")
        .concat(UZIP_1.F._writeLit, " \n    UZIP.F.inflate = ")
        .concat(UZIP_1.F.inflate, " \n    UZIP.F._check = ")
        .concat(UZIP_1.F._check, " \n    UZIP.F._decodeTiny = ")
        .concat(UZIP_1.F._decodeTiny, " \n    UZIP.F._copyOut = ")
        .concat(UZIP_1.F._copyOut, " \n    UZIP.F.makeCodes = ")
        .concat(UZIP_1.F.makeCodes, " \n    UZIP.F.codes2map = ")
        .concat(UZIP_1.F.codes2map, " \n    UZIP.F.revCodes = ")
        .concat(
          UZIP_1.F.revCodes,
          " \n\n    // used only in deflate\n    UZIP.F._putsE = "
        )
        .concat(UZIP_1.F._putsE, "\n    UZIP.F._putsF = ")
        .concat(UZIP_1.F._putsF, "\n  \n    UZIP.F._bitsE = ")
        .concat(UZIP_1.F._bitsE, "\n    UZIP.F._bitsF = ")
        .concat(UZIP_1.F._bitsF, "\n\n    UZIP.F._get17 = ")
        .concat(UZIP_1.F._get17, "\n    UZIP.F._get25 = ")
        .concat(
          UZIP_1.F._get25,
          "\n    UZIP.F.U = function(){\n      var u16=Uint16Array, u32=Uint32Array;\n      return {\n        next_code : new u16(16),\n        bl_count  : new u16(16),\n        ordr : [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ],\n        of0  : [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],\n        exb  : [0,0,0,0,0,0,0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4,  4,  5,  5,  5,  5,  0,  0,  0,  0],\n        ldef : new u16(32),\n        df0  : [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577, 65535, 65535],\n        dxb  : [0,0,0,0,1,1,2, 2, 3, 3, 4, 4, 5, 5,  6,  6,  7,  7,  8,  8,   9,   9,  10,  10,  11,  11,  12,   12,   13,   13,     0,     0],\n        ddef : new u32(32),\n        flmap: new u16(  512),  fltree: [],\n        fdmap: new u16(   32),  fdtree: [],\n        lmap : new u16(32768),  ltree : [],  ttree:[],\n        dmap : new u16(32768),  dtree : [],\n        imap : new u16(  512),  itree : [],\n        //rev9 : new u16(  512)\n        rev15: new u16(1<<15),\n        lhst : new u32(286), dhst : new u32( 30), ihst : new u32(19),\n        lits : new u32(15000),\n        strt : new u16(1<<16),\n        prev : new u16(1<<15)\n      };\n    } ();\n\n    (function(){\n      var U = UZIP.F.U;\n      var len = 1<<15;\n      for(var i=0; i<len; i++) {\n        var x = i;\n        x = (((x & 0xaaaaaaaa) >>> 1) | ((x & 0x55555555) << 1));\n        x = (((x & 0xcccccccc) >>> 2) | ((x & 0x33333333) << 2));\n        x = (((x & 0xf0f0f0f0) >>> 4) | ((x & 0x0f0f0f0f) << 4));\n        x = (((x & 0xff00ff00) >>> 8) | ((x & 0x00ff00ff) << 8));\n        U.rev15[i] = (((x >>> 16) | (x << 16)))>>>17;\n      }\n  \n      function pushV(tgt, n, sv) {  while(n--!=0) tgt.push(0,sv);  }\n  \n      for(var i=0; i<32; i++) {  U.ldef[i]=(U.of0[i]<<3)|U.exb[i];  U.ddef[i]=(U.df0[i]<<4)|U.dxb[i];  }\n  \n      pushV(U.fltree, 144, 8);  pushV(U.fltree, 255-143, 9);  pushV(U.fltree, 279-255, 7);  pushV(U.fltree,287-279,8);\n      /*\n        var i = 0;\n        for(; i<=143; i++) U.fltree.push(0,8);\n        for(; i<=255; i++) U.fltree.push(0,9);\n        for(; i<=279; i++) U.fltree.push(0,7);\n        for(; i<=287; i++) U.fltree.push(0,8);\n        */\n      UZIP.F.makeCodes(U.fltree, 9);\n      UZIP.F.codes2map(U.fltree, 9, U.flmap);\n      UZIP.F.revCodes (U.fltree, 9)\n  \n      pushV(U.fdtree,32,5);\n      //for(i=0;i<32; i++) U.fdtree.push(0,5);\n      UZIP.F.makeCodes(U.fdtree, 5);\n      UZIP.F.codes2map(U.fdtree, 5, U.fdmap);\n      UZIP.F.revCodes (U.fdtree, 5)\n  \n      pushV(U.itree,19,0);  pushV(U.ltree,286,0);  pushV(U.dtree,30,0);  pushV(U.ttree,320,0);\n      /*\n        for(var i=0; i< 19; i++) U.itree.push(0,0);\n        for(var i=0; i<286; i++) U.ltree.push(0,0);\n        for(var i=0; i< 30; i++) U.dtree.push(0,0);\n        for(var i=0; i<320; i++) U.ttree.push(0,0);\n        */\n    })()\n    "
        )
    );
  }
  function generateWorkerScript() {
    return createWorker(
      "\n    let scriptImported = false\n    self.addEventListener('message', async (e) => {\n      const { file, id, imageCompressionLibUrl, options } = e.data\n      options.onProgress = (progress) => self.postMessage({ progress, id })\n      try {\n        if (!scriptImported) {\n          // console.log('[worker] importScripts', imageCompressionLibUrl)\n          self.importScripts(imageCompressionLibUrl)\n          scriptImported = true\n        }\n        // console.log('[worker] self', self)\n        const compressedFile = await imageCompression(file, options)\n        self.postMessage({ file: compressedFile, id })\n      } catch (e) {\n        // console.error('[worker] error', e)\n        self.postMessage({ error: e.message + '\\n' + e.stack, id })\n      }\n    })\n  "
    );
  }
  function compressOnWebWorker(e, r) {
    return new Promise(function (t, a) {
      var i = (cnt += 1);
      imageCompressionLibUrl || (imageCompressionLibUrl = generateLib()),
        worker || (worker = generateWorkerScript()),
        worker.addEventListener("message", function handler(e) {
          if (e.data.id === i) {
            if (r.signal && r.signal.aborted) return;
            if (void 0 !== e.data.progress)
              return void r.onProgress(e.data.progress);
            worker.removeEventListener("message", handler),
              e.data.error && a(new Error(e.data.error)),
              t(e.data.file);
          }
        }),
        worker.addEventListener("error", a),
        r.signal &&
          r.signal.addEventListener("abort", function () {
            worker.terminate(), a(r.signal.reason);
          }),
        worker.postMessage({
          file: e,
          id: i,
          imageCompressionLibUrl: imageCompressionLibUrl,
          options: _objectSpread2(
            _objectSpread2({}, r),
            {},
            { onProgress: void 0, signal: void 0 }
          ),
        });
    });
  }
  function imageCompression(e, r) {
    return new Promise(function (t, a) {
      var i, s, f, c, l, u;
      if (
        ((i = _objectSpread2({}, r)),
        (f = 0),
        (c = i.onProgress),
        (i.maxSizeMB = i.maxSizeMB || Number.POSITIVE_INFINITY),
        (l = "boolean" != typeof i.useWebWorker || i.useWebWorker),
        delete i.useWebWorker,
        (i.onProgress = function (e) {
          (f = e), "function" == typeof c && c(f);
        }),
        !(e instanceof Blob || e instanceof CustomFile))
      )
        return a(
          new Error("The file given is not an instance of Blob or File")
        );
      if (!/^image/.test(e.type))
        return a(new Error("The file given is not an image"));
      if (
        ((u =
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope),
        !l || "function" != typeof Worker || u)
      )
        return compress(e, i).then(
          function (e) {
            try {
              return (s = e), $If_3.call(this);
            } catch (e) {
              return a(e);
            }
          }.bind(this),
          a
        );
      var d = function () {
          try {
            return $If_3.call(this);
          } catch (e) {
            return a(e);
          }
        }.bind(this),
        h = function $Try_1_Catch(r) {
          try {
            return compress(e, i).then(function (e) {
              try {
                return (s = e), d();
              } catch (e) {
                return a(e);
              }
            }, a);
          } catch (e) {
            return a(e);
          }
        };
      try {
        return compressOnWebWorker(e, i).then(function (e) {
          try {
            return (s = e), d();
          } catch (e) {
            return h();
          }
        }, h);
      } catch (e) {
        h();
      }
      function $If_3() {
        try {
          (s.name = e.name), (s.lastModified = e.lastModified);
        } catch (e) {}
        return t(s);
      }
    });
  }
  return (
    (imageCompression.getDataUrlFromFile = getDataUrlFromFile),
    (imageCompression.getFilefromDataUrl = getFilefromDataUrl),
    (imageCompression.loadImage = loadImage),
    (imageCompression.drawImageInCanvas = drawImageInCanvas),
    (imageCompression.drawFileInCanvas = drawFileInCanvas),
    (imageCompression.canvasToFile = canvasToFile),
    (imageCompression.getExifOrientation = getExifOrientation),
    (imageCompression.handleMaxWidthOrHeight = handleMaxWidthOrHeight),
    (imageCompression.followExifOrientation = followExifOrientation),
    (imageCompression.cleanupCanvasMemory = cleanupCanvasMemory),
    (imageCompression.isAutoOrientationInBrowser = isAutoOrientationInBrowser),
    (imageCompression.approximateBelowMaximumCanvasSizeOfBrowser =
      approximateBelowMaximumCanvasSizeOfBrowser),
    (imageCompression.getBrowserName = getBrowserName),
    (imageCompression.version = "2.0.0"),
    imageCompression
  );
});
//# sourceMappingURL=browser-image-compression.js.map
