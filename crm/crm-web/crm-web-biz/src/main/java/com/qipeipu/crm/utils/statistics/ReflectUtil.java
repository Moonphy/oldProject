package com.qipeipu.crm.utils.statistics;

import com.qipeipu.crm.dtos.visit.OrderFormEntity;
import sun.reflect.generics.tree.Tree;

import java.lang.reflect.*;
import java.util.*;

/**
 * Created by laiyiyu on 2015/5/21.
 */
public class ReflectUtil {

    public static List<String[]> ergodicCollection(Collection<?> input){
        if(BaseJudgeUtil.isEmpty(input)){
            return Collections.EMPTY_LIST;
        }
        List<String[]> result = new ArrayList<>();
        for(Object entity : input){
            result.add(ergodicEntityGetter(entity));
        }
        return result;
    }


    private static String[] ergodicEntityGetter(Object entity){
        String entityName = entity.getClass().getName();
        Class clazz = null;
        try {
            clazz = Class.forName(entityName);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        Field[] fields = clazz.getDeclaredFields();
        String[] values = new String[fields.length];
        int i = 0;
        for(Field field : fields){
            Type type = field.getType();
            if( type==List.class || type==Map.class || type== Tree.class || type==Set.class)
                continue;
            //String modifier = Modifier.toString(field.getModifiers());
            //String typeName = field.getType().getName();
            String fieldName = field.getName();
            values[i++] = String.valueOf(getter(field.getType(), entity, fieldName));
            //System.out.println(getter(field.getType(), entity, fieldName));
        }
        return values;
    }




    private static Object getter(Class<?> type, Object o, String paramName){
        StringBuilder methodName = new StringBuilder();
        methodName.append("get").append(("" + paramName.charAt(0) + "").toUpperCase()).append(paramName.substring(1, paramName.length()));
        //System.out.println(methodName.toString());
        Method m = null;
        Object result = null;
        try {
            m = o.getClass().getMethod(methodName.toString());
            result =  m.invoke(o);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        return result;
    }

    private static void setter(Class<?> type, Object o, String paramName, Object value){
        StringBuilder methodName = new StringBuilder();
        methodName.append("set").append(("" + paramName.charAt(0) + "").toUpperCase()).append(paramName.substring(1, paramName.length()));
        Method m = null;
        try {
            m = o.getClass().getMethod(methodName.toString(), type);
            m.invoke(o, value);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }


    }

    private int getEntityAttributeNum(Object o){
        return o.getClass().getDeclaredFields().length;
    }




    public static  void main(String[] args) throws ClassNotFoundException, IllegalAccessException, InstantiationException {
        //OrderFormEntity order = new OrderFormEntity();
        List<OrderFormEntity> input = new ArrayList<>();
        OrderFormEntity order = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();
        input.add(order);
        ergodicCollection(input);
       /* Class<?> c = Class.forName(OrderFormEntity.class.getName()) ;
        Object o = c.newInstance();*/
        /*Constructor<?>[] cons = c.getConstructors();
        for(Constructor con : cons){
            int mo = con.getModifiers();
            System.out.println("权限："+Modifier.toString(mo));
            System.out.println("构造名："+con.getName());
            System.out.println("参数类型");
            Class<?>[] params = con.getParameterTypes();
            for(int i=0;i<params.length;i++){
                System.out.print(params[i].getName()+" arg1, ");
            }
        }
        System.out.println("--------------------------");
        Method[] method = c.getMethods();
        for(Method m : method){
            System.out.println("method name:"+m.getName());
            System.out.println("method authority: "+Modifier.toString(m.getModifiers()));
            Class<?>[] params = m.getParameterTypes();
            for(int i=0;i<params.length;i++){
                System.out.print(params[i].getName()+" arg1, ");
            }
            System.out.println("--------------------------");
        }

        System.out.println("--------------------------");*/








    }






}
