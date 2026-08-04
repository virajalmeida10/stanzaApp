package com.almeida.viraj01.projects.stanzaApp.service;

import com.almeida.viraj01.projects.stanzaApp.entity.Room;

public interface InventoryService {

    void initializeRoomForAYear(Room room);

    void deleteFutureInventories(Room room);

}
