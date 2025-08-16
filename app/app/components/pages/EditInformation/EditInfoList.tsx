import { CardBody, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import React, { useState } from 'react';
import themeStore from '@/app/zustandData/theme.zustand';
import colorStore from '@/app/zustandData/color.zustand';
import EditInfoForm from './ChangePassword';
import useStore from "@/app/hooks/useStore";
import PersonalInformation from './PesonalInfo';
import Softwares from './Software';
import WorkingExperience from './WorkingExperience';
import BankAccounts from './BankAccounts';
import CoverLetter from './CoverLetter';
import PriodicalCheckUps from './Checkup';
import Education from './Education';
import Languages from './Languages';
import Forums from './Forums';
import Certificates from './Certificates';
import PersonnelFiles from './PersonnelFiles';
import Role from './Role';
import RoleClaims from './SetUserClaims';
import useLoginUserInfo from '@/app/zustandData/useLoginUserInfo';
import SignatureComponent from './Signature/MainContainer';
import MyCustomComponent from '@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui';

const EditInfoList = () => {
  const CurrentUser = useLoginUserInfo((state) => state);
  const themeMode = useStore(themeStore, (state) => state);
  const color = useStore(colorStore, (state) => state);
  const [activeTab, setActiveTab] = useState<string>("PersonalInfo");
  const Arr = CurrentUser.userInfo?.actors.length > 0 && CurrentUser.userInfo?.actors?.map((item: any) => item.claims.find((item: any) => item.key == 'UserManagement' && item.value == 'Admin')).filter((val: any) => val != null).length == 0 ?
    [
      {
        title: 'مشخصات فردی',
        component: <PersonalInformation />,
        val: 'PersonalInfo',
        key: 0
      },
      {
        title: 'مدارک پرسنلی',
        component: <PersonnelFiles />,
        val: 'PersonnelDocs',
        key: 1
      },
      {
        title: 'سوابق تحصیلی',
        component: <Education />,
        val: 'Education',
        key: 2
      },
      {
        title: 'دوره ها و گواهینامه ها',
        component: <Certificates />,
        val: 'Certificates',
        key: 3
      },
      {
        title: 'زبان های خارجی',
        component: <Languages />,
        val: 'Languages',
        key: 4
      },
      {
        title: 'نرم افزارهای تخصصی',
        component: <Softwares />,
        val: 'Software',
        key: 5
      },
      {
        title: 'عضویت در انجمن ها',
        component: <Forums />,
        val: 'Association membership',
        key: 6
      },
      {
        title: 'سوابق شغلی',
        component: <WorkingExperience />,
        val: 'WorkExperience',
        key: 7
      },
      {
        title: 'اطلاعات حساب بانکی',
        component: <BankAccounts />,
        val: 'BankAccounts',
        key: 8
      },
      {
        title: 'معاینات ادواری',
        component: <PriodicalCheckUps />,
        val: 'PriodicalCheckUps',
        key: 9
      },
      {
        title: 'توضیحات تکمیلی',
        component: <CoverLetter />,
        val: 'CoverLetter',
        key: 10
      },
      {
        title: 'تغیر رمز عبور',
        component: <EditInfoForm />,
        val: 'ChangePassword',
        key: 11
      },
    ] :
    [
      {
        title: 'مشخصات فردی',
        component: <PersonalInformation />,
        val: 'PersonalInfo',
        key: 0
      },
      {
        title: 'مدارک پرسنلی',
        component: <PersonnelFiles />,
        val: 'PersonnelDocs',
        key: 1
      },
      {
        title: 'تعریف امضاء',
        component: <SignatureComponent />,
        val: 'SignatureDefinition',
        key: 14
      },
      {
        title: 'سوابق تحصیلی',
        component: <Education />,
        val: 'Education',
        key: 2
      },
      {
        title: 'دوره ها و گواهینامه ها',
        component: <Certificates />,
        val: 'Certificates',
        key: 3
      },
      {
        title: 'زبان های خارجی',
        component: <Languages />,
        val: 'Languages',
        key: 4
      },
      {
        title: 'نرم افزارهای تخصصی',
        component: <Softwares />,
        val: 'Software',
        key: 5
      },
      {
        title: 'عضویت در انجمن ها',
        component: <Forums />,
        val: 'Association membership',
        key: 6
      },
      {
        title: 'سوابق شغلی',
        component: <WorkingExperience />,
        val: 'WorkExperience',
        key: 7
      },
      {
        title: 'اطلاعات حساب بانکی',
        component: <BankAccounts />,
        val: 'BankAccounts',
        key: 8
      },
      {
        title: 'معاینات ادواری',
        component: <PriodicalCheckUps />,
        val: 'PriodicalCheckUps',
        key: 9
      },
      {
        title: 'توضیحات تکمیلی',
        component: <CoverLetter />,
        val: 'CoverLetter',
        key: 10
      },
      {
        title: 'سمت ها',
        component: <Role />,
        val: 'Roles',
        key: 11
      },
      {
        title: 'دسترسی ها',
        component: <RoleClaims />,
        val: 'RolesClaims',
        key: 12
      }, {
        title: 'تغیر رمز عبور',
        component: <EditInfoForm />,
        val: 'ChangePassword',
        key: 13
      }

    ]

  return (

    <MyCustomComponent>
      <>
        <CardBody className='w-[98%] h-full mx-auto relative rounded-lg ' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <section className='w-full h-full  '>
            <Tabs orientation="vertical" className=' w-full flex flex-col-reverse gap-x-3 justify-between xs:flex-col sm:flex-col-reverse md:flex-col-reverse lg:flex-row lg:flex-row lg:justify-around lg:items-start overflow-auto' value="PersonalInfo" >
              <TabsBody
                animate={{
                  initial: { x: 10 },
                  mount: { x: 0 },
                  unmount: { x: 250 },
                }}
                className=' lg:block' placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {Arr.map((val) => (
                  <TabPanel key={val.key} value={val.val} className="p-0 w-full md:py-5 md:mx-h-[100vh] overflow-visable  md:overflow-visable md:h-auto lg:h-[79vh] lg:overflow-auto ">
                    {val.component}
                  </TabPanel>
                ))}
              </TabsBody>
              <TabsHeader className={`${!themeMode || themeMode?.stateMode ? 'contentDark' : 'contentLight'} m-5 `}
                indicatorProps={{
                  style: {
                    background: color?.color,
                    color: "white",
                    marginBottom: 20
                  },
                  className: `shadow !text-gray-900 flex flex-col `,
                }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {Arr.map((val, index) => (
                  <Tab className={`${!themeMode || themeMode?.stateMode ? 'lightText' : 'darkText'} whitespace-nowrap px-3 text-left text-sm h-[40px]`} style={{ color: activeTab == val.val ? 'white' : '' }} onClick={() => setActiveTab(val.val)} key={"Arr" + index} value={val.val} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {val.title}
                  </Tab>
                ))}
              </TabsHeader>
              {/* <TabsBody className='my-2 block lg:hidden'  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {Arr.map((val, index) => (
                <TabPanel key={'value' + index} value={val.val} className="p-0 w-full min-h-[551px] overflow-auto">
                  {val.component}
                </TabPanel>
              ))}
            </TabsBody> */}
            </Tabs>
          </section>
        </CardBody>

      </>
    </MyCustomComponent>
  )
}

export default EditInfoList