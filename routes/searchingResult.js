﻿var express = require('express');
var router = express.Router();

const connect_db = require('../modules/connect_db');

/* ------ Router tìm kiếm điện thoại -------- */
router.get('/dien-thoai', function (req, res, next) {    

    /*Các biến lưu tài khoản*/
    var account;
    var level;
    if (req.session.username) {
        account = req.session.username;
    }
    if (req.session.level) {
        level = req.session.level;
    }

    /*Các biến xử lý câu truy vấn và kết quả trả về*/
    var phones = [];
    var phoneNumber;
    var query = "SELECT * FROM dienthoai P INNER JOIN hinhanhdienthoai PI ON P.MaDienThoai = PI.MaDT ";

    /* ----- Xử lý câu lệnh query khi url có biến hang ------ */
    if (typeof req.query.hang != "undefined") {
        var hang = req.query.hang.split(",");
        query += "WHERE ( P.Hang = '" + hang[0] + "' ";
        for (var i = 1; i < hang.length; i++) {
            query += "OR P.Hang = '" + hang[i] + "' ";
        }
        query += ")";
    }

    /* ----- Xử lý câu lệnh query khi url có biến gia ------ */
    if (typeof req.query.gia != "undefined") {
        var gia = req.query.gia.split(",");
        if (typeof req.query.hang == "undefined") {
            query += "WHERE ( ";
        } else {
            query += "AND ( ";
        }

        for (var i = 0; i < gia.length; i++) {
            switch (gia[i]) {
                case "duoi1":
                    if (i == 0) {
                        query += "P.GiaBan < 1000000 ";
                    } else {
                        query += "OR P.GiaBan < 1000000 ";
                    }
                    break;
                case "1-3":
                    if (i == 0) {
                        query += "P.GiaBan > 1000000 AND P.GiaBan < 3000000 ";
                    } else {
                        query += "OR P.GiaBan > 1000000 AND P.GiaBan < 3000000 ";
                    }
                    break;
                case "3-6":
                    if (i == 0) {
                        query += "P.GiaBan > 3000000 AND P.GiaBan < 6000000 ";
                    } else {
                        query += "OR P.GiaBan > 3000000 AND P.GiaBan < 6000000 ";
                    }
                    break;
                case "6-10":
                    if (i == 0) {
                        query += "P.GiaBan > 6000000 AND P.GiaBan < 10000000 ";
                    } else {
                        query += "OR P.GiaBan > 6000000 AND P.GiaBan < 10000000 ";
                    }
                    break;
                case "10-15":
                    if (i == 0) {
                        query += "P.GiaBan > 10000000 AND P.GiaBan < 15000000 ";
                    } else {
                        query += "OR P.GiaBan > 10000000 AND P.GiaBan < 15000000";
                    }
                    break;
                case "15-25":
                    if (i == 0) {
                        query += "P.GiaBan > 15000000 AND P.GiaBan < 25000000 ";
                    } else {
                        query += "OR P.GiaBan > 15000000 AND P.GiaBan < 25000000 ";
                    }
                    break;
                case "tren25":
                    if (i == 0) {
                        query += "P.GiaBan > 25000000 ";
                    } else {
                        query += "OR P.GiaBan > 25000000 ";
                    }
                    break;
            }
        }
        query += ") "
    }

    query += "GROUP BY P.MaDienThoai "; /*Thêm lệnh gruop by vào câu query để chỉ lấy một hình ảnh cho mỗi sản phẩm*/

    /* ----- Xử lý câu lệnh query khi url có biến sap_xep ------ */
    if (typeof req.query.sap_xep != "undefined") {
        if (req.query.sap_xep == "cao den thap") {
            query += "ORDER BY P.GiaBan DESC";
        } else if (req.query.sap_xep == "thap den cao") {
            query += "ORDER BY P.GiaBan ASC";
        }
    }
    
    /* ----- Kết nối tới database và lấy data ------ */
    connect_db.con.query(query, function (err, result, feilds) {
        if (err) throw err;

        for (var i = 0; i < result.length; i++) {

            phones.push({
                id: result[i].MaDienThoai, hang: result[i].Hang, ten: result[i].TenDienThoai,
                giaBan: result[i].GiaBan, giaGoc: result[i].KhuyenMai + result[i].GiaBan,
                hinhAnh: result[i].DuongDan
            });

        }
        phoneNumber = result.length;

        res.json({ phones, phoneNumber, account, level });

    });


});

/*Router tìm kiếm phụ kiện*/
router.get('/phu-kien', function (req, res, next) {

    /*Các biến lưu tài khoản*/
    var account;
    var level;
    if (req.session.username) {
        account = req.session.username;
    }
    if (req.session.level) {
        level = req.session.level;
    }

    /*Các biến xử lý câu truy vấn và kết quả trả về*/
    var accessories = [];
    var accessoriesNumber;
    var query = "SELECT * FROM phukien A INNER JOIN hinhanhphukien AI ON A.MaPhuKien = AI.MaPhuKien ";

    /* ----- Xử lý câu lệnh query khi url có biến loai ------ */
    if (typeof req.query.loai != "undefined") {
        var loai = req.query.loai.split(",");
        query += "WHERE ( A.LoaiPhuKien = '" + loai[0] + "' ";
        for (var i = 1; i < loai.length; i++) {
            query += "OR A.LoaiPhuKien = '" + loai[i] + "' ";
        }
        query += ")";
    }

    /* ----- Xử lý câu lệnh query khi url có biến gia ------ */
    if (typeof req.query.gia != "undefined") {
        var gia = req.query.gia.split(",");
        if (typeof req.query.loai == "undefined") {
            query += "WHERE ( ";
        } else {
            query += "AND ( ";
        }

        for (var i = 0; i < gia.length; i++) {
            switch (gia[i]) {
                case "duoi200":
                    if (i == 0) {
                        query += "A.GiaBan < 200000 ";
                    } else {
                        query += "OR A.GiaBan < 200000 ";
                    }
                    break;
                case "200-500":
                    if (i == 0) {
                        query += "A.GiaBan > 200000 AND A.GiaBan <500000 ";
                    } else {
                        query += "OR A.GiaBan > 200000 AND A.GiaBan <500000 ";
                    }
                    break;
                case "500-1":
                    if (i == 0) {
                        query += "A.GiaBan > 500000 AND A.GiaBan < 1000000 ";
                    } else {
                        query += "OR A.GiaBan > 500000 AND A.GiaBan < 1000000 ";
                    }
                    break;
                case "1-2":
                    if (i == 0) {
                        query += "A.GiaBan > 1000000 AND A.GiaBan < 2000000 ";
                    } else {
                        query += "OR A.GiaBan > 1000000 AND A.GiaBan < 2000000 ";
                    }
                    break;
                case "2-5":
                    if (i == 0) {
                        query += "A.GiaBan > 2000000 AND A.GiaBan < 5000000 ";
                    } else {
                        query += "OR A.GiaBan > 2000000 AND A.GiaBan < 5000000";
                    }
                    break;
                case "tren5":
                    if (i == 0) {
                        query += "A.GiaBan > 5000000 ";
                    } else {
                        query += "OR A.GiaBan > 5000000 ";
                    }
                    break;
            }
        }
        query += ") "
    }

    query += "GROUP BY A.MaPhuKien "; /*Thêm group by để chỉ lấy một hình ảnh cho mỗi sản phẩm*/

    /* ----- Xử lý câu lệnh query khi url có biến sap_xep ------ */
    if (typeof req.query.sap_xep != "undefined") {
        if (req.query.sap_xep == "cao den thap") {
            query += "ORDER BY A.GiaBan DESC";
        } else if (req.query.sap_xep == "thap den cao") {
            query += "ORDER BY A.GiaBan ASC";
        }
    }

    /* ----- Kết nối tới database và lấy dữ liệu trả về ------ */
    connect_db.con.query(query, function (err, result, feilds) {
        if (err) throw err;

        for (var i = 0; i < result.length; i++) {

            accessories.push({
                id: result[i].MaPhuKien, loai: result[i].LoaiPhuKien, ten: result[i].TenPhuKien,
                giaBan: result[i].GiaBan, giaGoc: result[i].KhuyenMai + result[i].GiaBan,
                hinhAnh: result[i].DuongDan
            });

        }
        accessoriesNumber = result.length;
        res.json({ accessories, accessoriesNumber, account, level });

    });
});

module.exports = router;
