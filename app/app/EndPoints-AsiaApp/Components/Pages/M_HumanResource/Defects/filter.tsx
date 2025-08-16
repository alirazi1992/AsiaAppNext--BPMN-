"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CardBody, Checkbox, Typography } from "@material-tailwind/react";
import useStore from "@/app/hooks/useStore";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { themeStore } from "@/app/zustandData";
import { yupResolver } from "@hookform/resolvers/yup";
import MyCustomComponent from "@/app/EndPoints-AsiaApp/Components/Shared/CustomTheme_Mui";
import { useAcsUsers } from "@/app/Application-AsiaApp/M_HumanRecourse/fetchAllUsers";
import { useProfileDefectancesOther } from "@/app/Application-AsiaApp/M_HumanRecourse/fetchDefectancesOther";
import {
  FilterDefectsModel,
  ProfileDefectanceAllModel,
} from "@/app/Domain/M_HumanRecourse/Defects";
import { defectanceAdapter } from "@/app/adapters/defectanceAdapter";
import UserAsyncSelect from "@/app/components/shared/UserAsyncSelect";
import {
  latinCharPattern,
  persianCharPattern,
  validationMessages,
  UsersModel,
} from "@/app/Domain";
import { userAllProfileDefectances } from "@/app/Application-AsiaApp/M_HumanRecourse/fetchAllDefectances";
import DownloadAllUsersButton from "./DownloadAllUsersButton";

const FilterDefects = forwardRef(
  ({ setDefectances, setLoading }: FilterDefectsModel, ref) => {
    let SelectUserRef: any = useRef(null);
    const themeMode = useStore(themeStore, (state) => state);

    let [users, setUsers] = useState<any>([]);
    const [allUsersData, setAllUsersData] = useState<
      ProfileDefectanceAllModel[]
    >([]);

    const { fetchUsers } = useAcsUsers();
    const { fetchAllDefectances } = userAllProfileDefectances();
    const { fetchDefectancesOther } = useProfileDefectancesOther();

    const schema = yup.object().shape({
      selectedUser: yup
        .object({
          id: yup.string().required(validationMessages?.requiredUser),
          faName: yup
            .string()
            .required()
            .matches(latinCharPattern, validationMessages?.latinCharMessage),
          name: yup
            .string()
            .required()
            .matches(
              persianCharPattern,
              validationMessages?.persianCharMessage
            ),
        })
        .nullable()
        .required(validationMessages?.requiredUser),
    });

    const { reset, formState, setValue, getValues, watch } =
      useForm<UsersModel>({
        defaultValues: {
          selectedUser: {
            faName: "",
            name: "",
            id: "",
          },
          alluser: false,
        },
        mode: "all",
        resolver: yupResolver(schema),
      });

    const selectedUser = watch("selectedUser");
    const alluser = watch("alluser");
    const errors = formState.errors;

    useImperativeHandle(ref, () => ({
      ResetMethod: () => {
        reset();
      },
    }));

    const loadSearchedUserOptions = async (
      inputValue: string
    ): Promise<any[]> => {
      if (!inputValue) return users;
      const filtered = users.filter((user: any) =>
        user.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      return filtered;
    };

    useEffect(() => {
      const GetAllUserAcs = async () => {
        try {
          setLoading(true);
          const result = await fetchUsers();
          setUsers(Array.isArray(result) ? result : []);
        } catch (error) {
          setUsers([]);
        } finally {
          setLoading(false);
        }
      };
      GetAllUserAcs();
    }, []);

    useEffect(() => {
      let userId = getValues("selectedUser")?.id;
      if (!userId) return;
      let payload = {
        query: {
          userId: userId,
        },
      };
      const fetchData = async () => {
        setValue("alluser", false);
        try {
          setLoading(true);
          const data = await fetchDefectancesOther(payload);
          let user = getValues("selectedUser");
          let transformData = data?.map((item) => {
            return {
              ...item,
              faLastName: user?.faName,
            };
          });
          setDefectances(defectanceAdapter(transformData));
        } catch {
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [selectedUser]);

    useEffect(() => {
      const flagApi = getValues("alluser");
      if (!flagApi) return;
      const fetchData = async () => {
        setValue("selectedUser", {
          faName: "",
          name: "",
          id: "",
        });
        try {
          setLoading(true);
          const data = await fetchAllDefectances();
          setAllUsersData(data);
          let users: any = [];
          await data?.forEach((user: any) => {
            user?.defectTypes?.forEach((def: any) => {
              users?.push({
                id: def.name,
                faName: def.faName,
                name: def.name,
                expireDate: null,
                ...user,
              });
            });
          });
          setDefectances(defectanceAdapter(users));
        } catch (error) {
          console.error("Error fetching defectances:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [alluser]);

    return (
      <MyCustomComponent>
        <CardBody
          className={`w-[98%] my-3 mx-auto  ${
            !themeMode || themeMode?.stateMode ? "cardDark" : "carDLight"
          } `}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <section className="flex justify-between items-center my-2 w-[100%] flex-wrap">
            <div className="flex gap-2">
              <div className="w-[120px]">
                <Checkbox
                  onChange={(e) => {
                    setValue("alluser", e.currentTarget?.checked);
                  }}
                  checked={alluser}
                  dir="rtl"
                  crossOrigin={""}
                  color="blue-gray"
                  label={
                    <Typography
                      className={`flex font-medium ${
                        !themeMode || themeMode?.stateMode
                          ? "lightText"
                          : "darkText"
                      }`}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      همه کاربران
                    </Typography>
                  }
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              </div>
              {alluser && <DownloadAllUsersButton allUsers={allUsersData} />}
            </div>

            <div className="  max-w-[100%]  flex justify-end w-[300px]">
              <UserAsyncSelect
                value={selectedUser}
                selectRef={SelectUserRef}
                defaultOptions={users}
                loadOptions={loadSearchedUserOptions}
                onChange={(option) => setValue("selectedUser", option)}
              />
            </div>
          </section>
        </CardBody>
      </MyCustomComponent>
    );
  }
);
FilterDefects.displayName = "FilterDefects";

export default FilterDefects;
