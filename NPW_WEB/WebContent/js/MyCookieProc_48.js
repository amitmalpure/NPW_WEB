var today = new Date();
var expiry = new Date(today.getTime() + 30*24*3600*1000);
var cookieName = "npwcart";
var cookieNameAddress = "npwAddr";
var cookieNameOther = "npwOther";
var subtotal = 0;

$( document ).ready(function() 
{
	var sPageURL = window.location.search.substring(1);
    var url = window.location.href;

	if(url == '' || url.includes('index'))
	{
		setTimeout(populateCartInHome,5000);
		return;
	}
	else if(url.includes('cart'))
	{
		populateCartInCart();
	}
	else if(url.includes('address'))
	{
		populateAddress();
	}	
	
	if(url.includes('address') || url.includes('shipping') || url.includes('payment') || url.includes('review'))
	{
		setTimeout(populateSideBar,3000);
	}	
	
});
		
function storeValues(productId)
{
	setCookie(cookieName, productId, 'N');
		
	populateCartInHome();
	
	return true;
}

function setCookie(name,value,isOverwrite) 
{
	if(isOverwrite == 'N')
	{
		var Product1CK = getCookie(cookieName);
	
		if(Product1CK == null)
		{
			Product1CK = "";
		}
		
		value = Product1CK + "," + value;
	}
		
	var days = 30;
    var expires = "";
    
    if (days) 
    {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) 
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for(var i=0;i < ca.length;i++) 
    {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
    
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    
    return null;
}

function clearCart()
{
	setCookie(cookieName, '', 'Y');

	eraseCookie();
	
	populateCartInCart();
}

function eraseCookie() 
{   
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function removeFromCartInHome(productId)
{
	
}

function removeFromCartInCart(CartItemId, productId, productPrice)
{
	//delete element
	var carItem = document.getElementById(CartItemId);
	carItem.parentNode.removeChild(carItem);
	
	//update subtotal
	var totalCartAmoutStr = document.getElementById("Cart_SubTotal").innerHTML;
	totalCartAmoutStr = totalCartAmoutStr.replace("$", "");
	var totalCartAmout = parseInt(totalCartAmoutStr);
	document.getElementById("Cart_SubTotal").innerHTML = "$" + (totalCartAmout - productPrice);
	subtotal = totalCartAmout - productPrice;
	
	//delete from cookie
	removeProductFromCookie(name, productId);
}

function removeProductFromCookie(name, productId) 
{   
	var Product1CK = getCookie(cookieName);
	var Product1CKNew = "";
	
	if (Product1CK) 
	{
		var Product1CKArr = Product1CK.split(',');
							
		for(i = 0; i < Product1CKArr.length; i++)
		{
			if(!Product1CKArr[i].includes('productId'))
			{
				Product1CKNew += Product1CKArr[i];
			}
		}
	}
	
	setCookie(cookieName, productId, 'Y');
}

function populateCartInHome()
{
	var Product1CK = getCookie(cookieName);
	
	if (Product1CK) 
	{
		var Product1CKArr = Product1CK.split(',');
	
		var totalCartCountStr = document.getElementById("cartCount").innerHTML;
		var totalCartAmoutStr = document.getElementById("cartPrice").innerHTML;
		totalCartAmoutStr = totalCartAmoutStr.replace("$", "");
		totalCartAmoutStr = totalCartAmoutStr.replace("&nbsp;", "");
		
		var cartItemStr = "";
		
		var totalCartAmout = parseInt(totalCartAmoutStr);
		var totalCartCount = parseInt(totalCartCountStr);
		
		for(i = 0; i < Product1CKArr.length; i++)
		{
			var productDetails = Product1CKArr[i];
			
			if(productDetails == null || productDetails == '')
			{
				continue;
			}
			
			var productDetailsArr = productDetails.split('#');
			var productId = productDetailsArr[0];
			var productName = productDetailsArr[1];
			var productPrice = productDetailsArr[2];
	
			totalCartCount++;
			totalCartAmout = totalCartAmout + parseInt(productPrice);
			
			cartItemStr += 
				"<div class=\"dropdown-product-item\"><span class=\"dropdown-product-remove\" href=\"javascript:removeFromCartInHome(" + productId + ");\"><i class=\"icon-cross\"></i></span><a class=\"dropdown-product-thumb\" " +
				"href=\"shop-single.html?Product_ID=" + productId + "\"><img src=\"img/shop/products/nameplates/" + productId + "_th01.jpg\" alt=\"Product\"></a>"+
			    "<div class=\"dropdown-product-info\"><a class=\"dropdown-product-title\" href=\"shop-single.html?Product_ID=" + productId + "\">" + productName + "</a><span class=\"dropdown-product-details\">1 x $" + productPrice + "</span></div> </div>";	
		}
		
		var cartPriceStr = "<div class=\"toolbar-dropdown-group\"><div class=\"column\"><span class=\"text-lg\">Total:</span></div>"+
		"<div class=\"column text-right\"><span class=\"text-lg text-medium\">$" + totalCartAmout + "&nbsp;</span></div></div><div class=\"toolbar-dropdown-group\">"+
		"<div class=\"column\"><a class=\"btn btn-sm btn-block btn-secondary\" href=\"cart.html\">View Cart</a></div>"+
		"<div class=\"column\"><a class=\"btn btn-sm btn-block btn-success\" href=\"checkout-address.html\">Checkout</a></div></div>";  
			
			
		document.getElementById("cartIndex").innerHTML = document.getElementById("cartIndex").innerHTML + cartItemStr;
		document.getElementById("cartPrice").innerHTML = "$" + totalCartAmout + "&nbsp;";
		document.getElementById("cartPrice1").innerHTML = "$" + totalCartAmout;
		document.getElementById("cartCount").innerHTML = totalCartCount;
	}
}

function populateCartInCart()
{
	var Product1CK = getCookie(cookieName);

	var Product1CKArr = Product1CK.split(',');

	var cartItemStr = "";

	var totalCartAmout = 0;

	for(i = 0; i < Product1CKArr.length; i++)
	{
		var productDetails = Product1CKArr[i];

		if(productDetails == null || productDetails == '')
		{
			continue;
		}
		
		var productDetailsArr = productDetails.split('#');
		var productId = productDetailsArr[0];
		var productName = productDetailsArr[1];
		var productPrice = productDetailsArr[2];

		var productDetails = getProductDetails(productId);
		var disc = productDetails.Disc;
		var subType = productDetails.Sub_Type;
		var cust = productDetails.Customiation_1;
		
		totalCartAmout = totalCartAmout + parseInt(productPrice);

		cartItemStr +="<tr id = \"Cart_Item_" + i + "\"><td>" +
		"<div class=\"product-item\"><a class=\"product-thumb\" href=\"shop-single.html?Product_ID=" + productId + "\"><img src=\"img/shop/products/nameplates/" + productId + "_th01.jpg\" alt=\"Product\"></a>"+
		"<div class=\"product-info\">"+
		"  <h4 class=\"product-title\"><a href=\"shop-single.html?Product_ID=" + productId + "\">" + productName + "</a></h4><span><em>Type:</em> " + subType + "</span><span><em>Features:</em> " + cust + "</span>"+
		"</div></div>"+
		"</td>"+
		"<td class=\"text-center\">"+
		"<div class=\"count-input\">"+
		"<select class=\"form-control\"><option>1</option></select>"+
		"</div>"+
		"</td>"+
		"<td class=\"text-center text-lg text-medium\">$" + productPrice + "</td>"+
		"<td class=\"text-center text-lg text-medium\">$" + disc + "</td>"+
		"<td class=\"text-center\"><a class=\"remove-from-cart\" href=\"javascript:removeFromCartInCart('Cart_Item_" + i + "','" + productId + "','" + productPrice + "');\" data-toggle=\"tooltip\" title=\"Remove item\"><i class=\"icon-cross\"></i></a></td>"+
		"</tr>";
	}

	console.log(cartItemStr);

	document.getElementById("Cart_1").innerHTML = cartItemStr;
	document.getElementById("Cart_SubTotal").innerHTML = "$" + totalCartAmout;
	subtotal = totalCartAmout;
	
	setCookie(cookieNameOther, "subTotal=" + subtotal, 'Y');
}

function populateSideBar()
{
	var Product1CKOther = getCookie(cookieNameOther);

	var Product1CKOtherArr = Product1CKOther.split(',');

	if(Product1CKOtherArr && Product1CKOtherArr != null && Product1CKOtherArr.length > 0)
	{
		var subTotalStr = Product1CKOtherArr[0];
		
		if(subTotalStr.includes('subTotal'))
		{
			var subTotalVal = parseInt(subTotalStr.split('=')[1]);
			
			document.getElementById("Addr_SubTotal").innerHTML = "$" + subTotalVal;
			document.getElementById("Addr_Tax").innerHTML = "$" + (subTotalVal*0.1);
			document.getElementById("Addr_Total").innerHTML = "$" + (subTotalVal + subTotalVal*0.1);
		}

	}
}

function populateAddress()
{
	var Product1CK = getCookie(cookieNameAddress);

	if(Product1CK)
	{
		var Product1CKArr = Product1CK.split(',');

		if(Product1CKArr && Product1CKArr != null && Product1CKArr.length > 0)
		{
			var fName = Product1CKArr[0];
			var lName = Product1CKArr[1];
			var email = Product1CKArr[2];
			var phone = Product1CKArr[3];
			var company = Product1CKArr[4];
			var city = Product1CKArr[5];
			var zip = Product1CKArr[6];
			var addr1 = Product1CKArr[7];
			var addr2 = Product1CKArr[8];
	
			document.getElementById("checkout-fn").value = fName;
			document.getElementById("checkout-ln").value = lName;
			document.getElementById("checkout-email").value = email;
			document.getElementById("checkout-phone").value = phone;
			document.getElementById("checkout-company").value = company;
			document.getElementById("checkout-city").value = city;
			document.getElementById("checkout-zip").value = zip;
			document.getElementById("checkout-address1").value = addr1;
			document.getElementById("checkout-address2").value = addr2;
		}
	}
}

function saveAddressCookie()
{
	var fName = document.getElementById("checkout-fn").value;
	var lName = document.getElementById("checkout-ln").value;
	var email = document.getElementById("checkout-email").value;
	var phone = document.getElementById("checkout-phone").value;
	var company = document.getElementById("checkout-company").value;
	var city = document.getElementById("checkout-city").value;
	var zip = document.getElementById("checkout-zip").value;
	var addr1 = document.getElementById("checkout-address1").value;
	var addr2 = document.getElementById("checkout-address2").value;

	var Product1CKStr = fName + "," + lName + "," + email + "," + phone + "," + company + "," + city + "," + zip + "," + addr1 + "," + addr2; 

	if(!Product1CKStr.startsWith(",,,"))
	{
		setCookie(cookieNameAddress, Product1CKStr, 'Y');	
	}
	
	setCookie(cookieNameAddress, Product1CKStr, 'Y');
}
