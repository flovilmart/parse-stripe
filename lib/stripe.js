/* 
        Copyright 2012, 
        Florent Vilmart  
 - ✄ - I Can Go Without - ✄ - 
    
*/

exports.Stripe = function (api_key, options) {
    var defaults = options || {};
    var auth = 'Bearer ' +api_key;

    function _request(method, path, data, callback) {

        var url = "https://api.stripe.com"+path;
        var request_options = {
            url: url,
            headers: {
                  'Authorization': auth,
                  'Accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
            method: method,
        }
        if (method == 'GET') {
            request_options.params = data;
        }else{
            request_options.body = data;
        }

        function _callback(httpResponse){
            callback(null, httpResponse.data);
        }
        //var cb = _callback(callback);
        request_options.success = _callback;
        request_options.error = _callback;
        
        Parse.Cloud.httpRequest(request_options);
    }

    function post(path, data, callback) {
        _request('POST', path, data, callback);
    }

    function get(path, data, callback) {
        _request('GET', path, data, callback);
    }

    function del(path, data, callback) {
        _request('DELETE', path, data, callback);
    }

    return {
        charges: {
            create: function (data, cb) {
                post("/v1/charges", data, cb);
            },
            retrieve: function(charge_id, cb) {
                if(!(charge_id && typeof charge_id === 'string')) {
                    cb("charge_id required");
                }
                get("/v1/charges/" + charge_id, {}, cb);
            },
            refund: function(charge_id, amount, cb) {
                var requestParams = {};
                if(!(charge_id && typeof charge_id === 'string')) {
                    cb("charge_id required");
                }
                if (typeof amount === 'function') {
                    cb = amount;
                    amount = null;
                }
                if (amount) {
                    requestParams.amount = amount;
                }
                post("/v1/charges/" + charge_id + "/refund", requestParams, cb);
            },
            list: function(data, cb) {
                get("/v1/charges", data, cb);
            },
        },
        customers: {
            create: function (data, cb) {
                post("/v1/customers", data, cb);
            },
            retrieve: function(customer_id, cb) {
                if (!(customer_id && typeof customer_id === 'string')) {
                    return cb("customer_id required");
                }
                get("/v1/customers/" + customer_id, {}, cb);
            },
            update: function(customer_id, data, cb) {
                post("/v1/customers/" + customer_id, data, cb);
            },
            del: function(customer_id, cb) {
                del("/v1/customers/" + customer_id, {}, cb);
            },
            list: function(count, offset, cb) {
                get("/v1/customers", { count: count, offset: offset}, cb );
            },
            update_subscription: function(customer_id, data, cb) {
                post("/v1/customers/" + customer_id + '/subscription', data, cb);
            },
            cancel_subscription: function(customer_id, at_period_end, cb) {
                del("/v1/customers/" + customer_id + '/subscription', { at_period_end: at_period_end }, cb);
            }
        },
        plans: {
            create: function (data, cb) {
                post("/v1/plans", data, cb);
            },
            retrieve: function(plan_id, cb) {
                if (!(plan_id && typeof plan_id === 'string')) {
                    return cb("plan_id required");
                }
                get("/v1/plans/" + plan_id, {}, cb);
            },
            del: function(plan_id, cb) {
                del("/v1/plans/" + plan_id, {}, cb);
            },
            list: function(count, offset, cb) {
                get("/v1/plans", { count: count, offset: offset}, cb );
            },
            update: function (plan_id, data, cb) {
                post("/v1/plans/" + plan_id, data, cb);
            }
        },
        invoices: {
            retrieve: function(invoice_id, cb) {
                get("/v1/invoices/" + invoice_id, {}, cb);
            },
            list: function(data, cb) {
                get("/v1/invoices", data, cb);
            },
            upcoming: function(customer_id, cb) {
                get("/v1/invoices/upcoming", { customer: customer_id }, cb);
            },
        },
        invoice_items: {
            create: function(data, cb) {
                post("/v1/invoiceitems", data, cb);
            },
            retrieve: function(invoice_item_id, cb) {
                if (!(invoice_item_id && typeof invoice_item_id === 'string')) {
                    return cb("invoice_item_id required");
                }
                get("/v1/invoiceitems/" + invoice_item_id, {}, cb);
            },
            update: function(invoice_item_id, data, cb) {
                post("/v1/invoiceitems/" + invoice_item_id, data, cb);
            },
            del: function(invoice_item_id, cb) {
                del("/v1/invoiceitems/" + invoice_item_id, {}, cb);
            },
            list: function(customer_id, count, offset, cb) {
                get("/v1/invoiceitems", { customer: customer_id, count: count, offset: offset}, cb );
            }
        },
        coupons: {
            create: function (data, cb) {
                post("/v1/coupons", data, cb);
            },
            retrieve: function(coupon_id, cb) {
                if (!(coupon_id && typeof coupon_id === 'string')) {
                    cb("coupon_id required");
                }
                get("/v1/coupons/" + coupon_id, {}, cb);
            },
            del: function(coupon_id, cb) {
                del("/v1/coupons/" + coupon_id, {}, cb);
            },
            list: function(count, offset, cb) {
                get("/v1/coupons", { count: count, offset: offset}, cb );
            }
        },
        token: {
            create: function (data, cb) {
                post("/v1/tokens", data, cb)
            },
            retrieve: function (token_id, cb) {
                get("/v1/tokens/" + token_id, {}, cb)
            }
        },
        events: {
            retrieve: function (token_id, cb) {
                get("/v1/events/" + token_id, {}, cb)
            },
            list: function (cb) {
                get("/v1/events/", {}, cb)
            }
        },
    };
}
