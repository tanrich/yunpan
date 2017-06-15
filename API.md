## API

### 首页

1. 登陆
/login 

		req
		{
			l_username,
			l_password,
			l_checkCode
		}
		
		res
		{
			status: 0 //失败
			status: 1 //成功
		}

2. 注册

/register

	req		
	{
		r_username,
		r_password,
		r_confirm_password,
		r_checkCode
	}
	
	res
	{
		status: 0 //失败
		status: 1 //成功
	} 

3. 验证码验证

	/vcheckcode
	
		req 
		{
			checkCode
		}	
		res 
		{
			status: [0, 1]
		}	
4. 注册用户名验证

	/vcheckrusername
	
		req
		{
			r_username
		}	
		res
		{
			status: [0, 1]
		}
### 云盘

1. 登陆状态检测

	/ vchecklogin
	
		req
		{
		}
		res
		{
			username,
			avatar,
			status: [0, 1]
		}

1. 获取所有文件

	/getallfiles

		req
		{
			path
		}
		
		res
		[
			{
				file_type:['all','picture','document','movie','gzip','music','others','package'],
				file_name,
				file_path,
				file_id
			}
		]
	
	/getfiles
	
		req
		{
			type: ['all','picture','document','movie','gzip','music','others','package']
		}
2. 上传

	/upload
	
		req
		{
			
		}
		
		res
		{
			status: [0,1]
		}
		
3. 新建文件夹

	/newFilePackage
	
		req
		{
			package_name
		}		
		
		res
		{
			status: [0,1]
		}
		
4. 下载文件

	根据文件信息直接下载
	
5. 删除

	/delete
		
		req
		{
			file_id,
			file_name
		}			
		
		res
		{
			status: [0,1]
		}
		
6. 重命名

	/rename
		
		req
		{
			file_id,
			file_name
		}		
		
		res
		{
			status: [0,1]
		}
		